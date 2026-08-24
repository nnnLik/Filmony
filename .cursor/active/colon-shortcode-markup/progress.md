# Progress: colon-shortcode-markup

**Status:** `in_progress`

## 2026-08-24 — catalog shortcode + write canonicalize

- Exposed `shortcode` on `ReactionCatalogItem` / `ReactionCatalogItemResponse` and copied it in the catalog mapper.
- Comment and feed-post validators load id→shortcode maps when the body has `:`, `⟦r`, or `[[r`, then `rewrite_reaction_tokens`; unknown legacy ids still error; unknown `:foo:` stays literal.
- Re-check max length after rewrite; card-ref / mention / spoiler validation still runs after canonicalize.
- Tests: unit validators + catalog/comment/feed-post integration stubs for `shortcode` and rewrite.

## 2026-08-24 — artifacts created

- Created `.cursor/features/colon-shortcode-markup/feature.md` (scope + acceptance criteria).
- Created `.cursor/active/colon-shortcode-markup/plan.md` (step-by-step implementation).
- Created this `progress.md`.
- Added `colon-shortcode-markup` as `in_progress` #1 in `.cursor/HOT.md`; existing in_progress items kept; `recent_completed` unchanged.

Implementation remaining: watch-note validators, frontend parsers/overlay/autocomplete, spoiler `||` already in working tree, closeout docs/PR.
