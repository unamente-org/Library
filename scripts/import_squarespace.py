#!/usr/bin/env python3
"""Copy live UnaMente library entries from Squarespace into entry files, unchanged.

Input: a folder of page-data files saved from each live entry's address with
"?format=json" added. Output: content/entries/<id>/index.en.md, plus a trimmed
snapshot of what was read in snapshots/<date>/, so anyone can check the copy
against the source.

The wording is never edited. The page body is converted from HTML to Markdown
(formatting only) with pandoc. Header values come from the live tags and
categories exactly as written there. Fields the live page does not hold are
left empty or "not stated" (design B5); they are never guessed.

Run: python3 scripts/import_squarespace.py /path/to/json-folder 2026-11-17
"""
import json, pathlib, re, subprocess, sys, datetime

src = pathlib.Path(sys.argv[1]); day = sys.argv[2]
repo = pathlib.Path(__file__).resolve().parent.parent
snap_dir = repo / "snapshots" / day; snap_dir.mkdir(parents=True, exist_ok=True)

def q(s):  # YAML double-quoted string
    return '"' + str(s).replace("\\", "\\\\").replace('"', '\\"') + '"'

def ylist(xs):
    return "[" + ", ".join(q(x) for x in xs) + "]"

def tagged(tags, prefix):
    return [t.split(":", 1)[1].strip() for t in tags if t.startswith(prefix + ":")]

count = 0
for f in sorted(src.glob("*.json")):
    item = json.loads(f.read_text(encoding="utf-8")).get("item")
    if not item or not item.get("urlId") or not item.get("body"):
        continue
    slug = item["urlId"]
    tags = item.get("tags") or []
    seo = (item.get("seoData") or {}).get("seoDescription") or ""
    day_of = lambda ms: datetime.datetime.fromtimestamp(ms / 1000, datetime.UTC).strftime("%Y-%m-%d")
    html = item["body"]
    # Squarespace splits one italic run around each link (</em><a><em>x</em></a><em>).
    # Markdown cannot express that cleanly and shows stray asterisks, so the link is
    # put back inside the single italic run. Wording and formatting are unchanged.
    html = re.sub(r"</em>(<a [^>]*>)<em>(.*?)</em></a><em>", r"\1\2</a>", html)
    # Rarer: a plain (not italic) link between two italic runs. Markdown cannot show
    # that either, so the link joins the italic run: the one formatting change this
    # script makes, logged in the import notes. Wording is unchanged.
    html = re.sub(r"</em>(<a [^>]*>)(?!<em>)(.*?)</a><em>", r"\1\2</a>", html)
    body = subprocess.run(["pandoc", "-f", "html", "-t", "gfm-raw_html", "--wrap=none"],
                          input=html, capture_output=True, text=True, check=True).stdout
    known = {"Lane", "Trust", "Maturity", "Setting", "Type"}
    other = [t for t in tags if t.split(":", 1)[0] not in known]
    front = [
        "---",
        f"# Copied unchanged from the live Squarespace entry on {day}. Source: {item.get('fullUrl')}",
        f"id: {q(slug)}",
        f"url: {q('/library/' + slug + '/')}",
        f"title: {q(item.get('title', ''))}",
        f"summary: {q(seo)}",
        "status: published",
        f"lane: {ylist(tagged(tags, 'Lane'))}",
        f"category: {ylist(item.get('categories') or [])}",
        f"trust: {ylist(tagged(tags, 'Trust'))}",
        f"maturity: {q(', '.join(tagged(tags, 'Maturity')))}",
        f"setting: {q(', '.join(tagged(tags, 'Setting')))}",
        f"entry_type: {q(', '.join(tagged(tags, 'Type')))}",
    ]
    if other:
        front.append(f"other_tags: {ylist(other)}")
    front += [
        f"published_on: {q(day_of(item['publishOn']))}" if item.get("publishOn") else 'published_on: ""',
        f"live_updated_on: {q(day_of(item['updatedOn']))}" if item.get("updatedOn") else 'live_updated_on: ""',
        f"source_page: {q(item.get('fullUrl') and 'https://www.unamente.org' + item['fullUrl'])}",
        f"image_live: {q(item.get('assetUrl') or '')}",
        "place:",
        '  country: "not stated"',
        '  region: "not stated"',
        '  climate: "not stated"',
        "credits: []",
        "sources: []   # the entry's Sources line is in the body, copied unchanged",
        "---",
        "",
    ]
    out = repo / "content" / "entries" / slug; out.mkdir(parents=True, exist_ok=True)
    # Header lines set by hand are kept on a re-sync, never overwritten by the live values:
    # safety_figures (Verus sets it), and any published_on that carries a "#" note (a date
    # Daniela gave, e.g. Fog Nets). Everything else comes fresh from the live page.
    old = out / "index.en.md"
    if old.exists():
        prev = old.read_text(encoding="utf-8").split("\n---\n", 1)[0].splitlines()
        sf = [l for l in prev if l.startswith("safety_figures:")]
        po = [l for l in prev if l.startswith("published_on:") and "#" in l]
        if sf:
            front.insert(front.index(next(l for l in front if l.startswith("entry_type:"))) + 1, sf[0])
        if po:
            front[front.index(next(l for l in front if l.startswith("published_on:")))] = po[0]
    (out / "index.en.md").write_text("\n".join(front) + body, encoding="utf-8")
    keep = {k: item.get(k) for k in ("title", "urlId", "fullUrl", "tags", "categories",
                                    "publishOn", "updatedOn", "assetUrl", "seoData", "body")}
    (snap_dir / f"{slug}.json").write_text(json.dumps(keep, ensure_ascii=False, indent=1), encoding="utf-8")
    count += 1
print(f"{count} entries copied; snapshots in snapshots/{day}/")
