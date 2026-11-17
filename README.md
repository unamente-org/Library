# UnaMente Library

The source of the UnaMente library: a free, permanent library of proven community-scale innovations. Each entry is a plain-text file in this repository, and a static website is built from those files. No paywalls, no logins, no database to keep running.

**Status: test build.** Nothing here is public. The site carries a "test build" banner and tells search engines not to index it. The only entry is a placeholder used to check the layout.

## Where things are

| Path | What it holds |
|---|---|
| `content/entries/<id>/index.en.md` | One entry. The folder name is the entry's permanent ID. Other languages sit beside it as `index.es.md`, `index.fr.md` and so on. |
| `content/_index.en.md` | The library's front page text. |
| `layouts/` | How pages look. Entry pages follow `UnaMente_Entry_Template_Spec`: the header table, then the spec's sections in its order, then Sources. |
| `static/` | Stylesheet and the small search/filter script (no libraries; works offline once loaded). |
| `hugo.toml` | Site settings, including the list of languages. |

## How an entry is written

The top of each file holds the header fields from the spec (lane, category, origin, maturity, trust, licence, entry date, documented by), plus a short summary, search keywords, and the source list. Each source has a label, a URL, an optional archived copy, a language and a note. The body holds the spec's sections as headings, in the spec's order, under the spec's own names.

**The entry structure belongs to Verus.** Adding, removing, renaming, splitting, merging or reordering any section or field needs his sign-off first. The proposed additions (permanent IDs, publication status, translation fields, contributor credit, structured place fields, the Lane 2 Basis field) are in `UnaMente_Cimiento_LibraryDesign_Proposal_2026-11-16` on the Project shelf. Until he rules, the only proposed field present in the templates is the translation notice, which shows nothing on English pages.

## Building it

Install [Hugo](https://gohugo.io/) (extended edition, v0.158 or later), then run:

```
hugo server     # preview at http://localhost:1313
hugo --minify   # build the site into public/
```

## Not decided yet

- The public address. `baseURL` in `hugo.toml` is a placeholder until it is chosen.
- The host. Cloudflare Pages is the recommendation in the options paper.
- When the repository becomes public as an open dataset.
