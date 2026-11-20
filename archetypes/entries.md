---
# ---- Identity (design B1, approved by Verus 16 November 2026) ----
# id never changes and is never reused. The public address can change; old addresses go in data/redirects.yaml.
id: ""
url: ""                 # public address, e.g. /library/zeer-pot-a-fridge-that-runs-on-nothing/
title: ""
summary: ""

# ---- Publication status (B2), separate from the trust tier ----
# draft | in-review | published | unverified-submission
# An unverified submission shows NO trust tier at all.
status: draft

# ---- Spec section 1: header / at-a-glance (UnaMente_Entry_Template_Spec) ----
lane: []                # e.g. ["Lane 1 — Solutions"]
track: ""               # 1 (buildable) or 2 (knowledge)
category: []
origin: ""              # free text, as on the entry
maturity: ""            # Idea / Tested / Proven / Scaled, as written on the entry
setting: ""             # e.g. Rural, as in the live "Setting:" tag
entry_type: ""          # e.g. Technical, as in the live "Type:" tag ("type" is reserved by Hugo)
trust: []               # Strong / Moderate / Limited
licence: ""
entry_date: ""          # YYYY-MM-DD
documented_by: ""
keywords: []
published_on: ""        # first published, YYYY-MM-DD
source_page: ""         # where the text was copied from, during the move off Squarespace
image_live: ""          # the image's address on the old Squarespace site, kept for the record. The illustration itself is set in data/illustrations.yaml, not here

# ---- Structured place (B5): only what the entry's own sources state; otherwise "not stated", never inferred ----
place:
  country: "not stated"
  region: "not stated"
  climate: "not stated"

# ---- Contributor credit (B4): credit only, never contact details ----
credits: []
#  - name: ""
#    contributed: ""
#    date: ""
#    verified_by: ""     # helper and date, e.g. "Verus, 2026-11-16"

# ---- Lane 2 only (B6) ----
# basis: one of the three values in UnaMente_Lane2_PreservedKnowledge_Template_and_Protocol_2026-11-15
basis: ""
custodian_contact: []   # shown to readers as "Custodian contact": dated approaches and replies
#  - date: ""
#    note: ""

# ---- Translations (B3): only in non-English files ----
safety_figures: true   # true if a mistranslated number or a mistranslated "not" could lead to physical harm: doses, temperatures, ratios, limits, and plain safety instructions with no number ("it does not make the water safe to drink"). Missing counts as true. Verus sets this, and checks it again whenever the entry's text changes.
                       # Left true (or missing), an unchecked machine translation of this entry cannot be published.
# translation:         # only in translated files (index.es.md, index.fr.md, ...)
#   from_revision: ""   # git revision of the English file this was made from
#   status: unchecked   # unchecked | checked. Unchecked pages show "Machine-translated, not checked."
#   checked_by: ""
#   checked_on: ""

# ---- Spec section 10: sources ----
sources: []
#  - label: ""
#    url: ""
#    archive: ""        # Wayback copy
#    language: ""
#    note: ""
---
