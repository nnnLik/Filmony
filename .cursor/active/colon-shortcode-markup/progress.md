# Progress: colon-shortcode-markup

**Status:** `in_progress`

## 2026-08-24 — catalog shortcode + write canonicalize

- Exposed `shortcode` on `ReactionCatalogItem` / `ReactionCatalogItemResponse` and copied it in the catalog mapper.
- Comment and feed-post validators load id→shortcode maps when the body has `:`, `⟦r`, or `[[r`, then `rewrite_reaction_tokens`; unknown legacy ids still error; unknown `:foo:` stays literal.
- Re-check max length after rewrite; card-ref / mention / spoiler validation still runs after canonicalize.
- Tests: unit validators + catalog row/schema; catalog/comment/feed-post integration stubs for `shortcode` and rewrite.
- Verification (host venv, Docker unavailable): ruff check/format on touched files passed; `pytest -n0 --no-cov` for comment/feed-post validator + shortcode helper units: 25 passed. Integration HTTP tests not run (no Postgres).

## 2026-08-24 — artifacts created

- Created `.cursor/features/colon-shortcode-markup/feature.md` (scope + acceptance criteria).
- Created `.cursor/active/colon-shortcode-markup/plan.md` (step-by-step implementation).
- Created this `progress.md`.
- Added `colon-shortcode-markup` as `in_progress` #1 in `.cursor/HOT.md`; existing in_progress items kept; `recent_completed` unchanged.

## 2026-08-24 — picker/compose insert `:shortcode:`

- Threaded catalog `shortcode` through `ReactionCatalogItem` and picker `apply(id, shortcode)`.
- `CommentReactionTokenPicker` public prop is `onPickReactionType(id, shortcode)`; recents still record id.
- Insert helpers (comment draft, watch note, feed compose, feed cards) call `reactionTokenForInsert(id, shortcode)`.
- Parents: `CommentComposeBar`, `CommentThreadSection`, `EngagementCommentsRow`, `MovieCardDetailPage`.

Implementation remaining: colon autocomplete, closeout docs/PR.
