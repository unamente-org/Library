#!/usr/bin/env python3
"""Check every entry file before it is published.

Reports, for each entry: a missing id or status, a status outside the agreed
set, a trust tier on an unverified submission, sources without a URL, and
place fields left blank instead of "not stated". It changes nothing; it only
lists problems, so a person decides what to do. Run: python3 scripts/check_entries.py
"""
import pathlib, re, sys

STATUSES = {"draft", "in-review", "published", "unverified-submission"}
root = pathlib.Path(__file__).resolve().parent.parent / "content" / "entries"
problems = 0

def field(front, name):
    m = re.search(rf"^{name}:\s*(.*)$", front, re.M)
    return None if m is None else m.group(1).strip().strip('"')

for f in sorted(root.glob("*/index.*.md")):
    text = f.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    rel = f.relative_to(root.parent.parent)
    if not m:
        print(f"{rel}: no front matter"); problems += 1; continue
    front = m.group(1)
    issues = []
    if not field(front, "id"): issues.append("no id")
    status = field(front, "status")
    if status not in STATUSES: issues.append(f"status {status!r} is not one of {sorted(STATUSES)}")
    trust = field(front, "trust")
    if status == "unverified-submission" and trust not in (None, "[]", ""):
        issues.append("unverified submission must not carry a trust tier")
    for block in re.findall(r"- label:.*?(?=\n  - label:|\n[a-z_]+:|\Z)", front, re.S):
        if not re.search(r"url:\s*\S", block): issues.append("a source has no url")
    for key in ("country", "region", "climate"):
        v = re.search(rf"^\s+{key}:\s*(.*)$", front, re.M)
        if v is None or v.group(1).strip().strip('"') == "":
            issues.append(f"place {key} is blank (use \"not stated\")")
    for i in issues:
        print(f"{rel}: {i}")
    problems += len(issues)

print(f"{problems} problem(s) found." if problems else "All entries pass the checks.")
sys.exit(1 if problems else 0)
