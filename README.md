# UnaMente Library

The source of the UnaMente library: a free, permanent library of proven community-scale innovations. Each entry is a plain-text file in this repository, and a static website is built from those files. No paywalls, no logins, no database to keep running.

**Read the library at https://library.unamente.org** (in English, with a first part in Español; French and Portuguese are on the way).

UnaMente is a Washington State nonprofit. It gathers community-scale innovations from around the world: water, food, energy, soil, health, waste, living alongside wildlife, and traditional knowledge. It checks each one against real sources, says openly how strong the evidence is and when the method does *not* work, and gives it all away free. No paywalls, no logins.

The library has three kinds of entry:
- **Solutions:** build-it-yourself methods with real, free instructions.
- **Preserved Knowledge:** traditional knowledge that belongs to its custodians. It is documented with respect, never as a blueprint to copy, and it is **not ours to license**.
- **Stories:** inspiring projects and people, some of them patented or commercial, with clear notes saying which is which.

### Using the library's data

- **The whole library as one file:** https://library.unamente.org/library.json. It holds every published entry and every Calling All Minds question, with their sources.
- **Every entry's history** is in this repository: every change, when it was made, and why.
- **Licence:** UnaMente's own text is CC BY-SA 4.0. Linked guides, images and quoted material belong to their authors, and traditional knowledge belongs to its custodians. The details are in [LICENSE.md](LICENSE.md).

### Corrections and suggestions

Found a mistake, a better source, or a poor translation? Write to info@unamente.org or use the contact form at https://www.unamente.org. Native speakers' corrections to the translated pages are especially welcome.

Entries are researched and checked by people working with UnaMente's AI helpers. How that works: https://www.unamente.org/how-we-use-ai

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

**The entry structure belongs to Verus.** Adding, removing, renaming, splitting, merging or reordering any section or field needs his sign-off first. On 16 November 2026 he approved the six additions in `UnaMente_Cimiento_LibraryDesign_Proposal_2026-11-16`, with changes. The full field list, with comments, is in `archetypes/entries.md`. In short:

- **`id`** never changes and is never reused. The public address (`url`) may change; every old address goes in `data/redirects.yaml`.
- **`status`** is one of draft, in-review, published or unverified-submission. An unverified submission shows **no** trust tier at all.
- **`place`** fields hold only what the entry's own sources state, and otherwise read "not stated". They are never inferred.
- **`credits`** are credit only, never contact details. "Verified by" names the helper and the date.
- **Lane 2:** `basis` (the three values in the 15 November protocol), and `custodian_contact`, shown as "Custodian contact": a dated record of approaches and replies.
- **Translations** carry `from_revision` and a checked or unchecked status, shown to readers. Whether unchecked translations may go live is Daniela's decision.

## Building it

Install [Hugo](https://gohugo.io/) (extended edition, v0.158 or later), then run:

```
hugo server     # preview at http://localhost:1313
hugo --minify   # build the site into public/
```

## Checks before publishing

`python3 scripts/check_entries.py` lists, for every entry: a missing id or status, a status outside the agreed set, a trust tier on an unverified submission, a source without a URL, and place fields left blank instead of "not stated". It changes nothing; a person decides what to do about each problem.

## Old addresses

Every change of an entry's public address adds a line to `data/redirects.yaml`. The build turns that list into a `_redirects` file, which Cloudflare Pages uses to send old links on to the new address (301).

## Where it runs

The site is built and hosted on Cloudflare Pages: the `main` branch is the live library, and `scaffold` is a preview that search engines are told not to index.
