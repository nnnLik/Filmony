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

## 2026-08-24 — comment compose `:shortcode:` autocomplete + edit expand

- Added `parseActiveShortcodeQuery` (Discord-like `:` query; rejects `10:30`, `hello:`, closing `:gasp:`).
- `expandLegacyReactionTokens` rewrites `⟦r{id}⟧` / `[[r{id}]]` to `:shortcode:` when the id is in the catalog map.
- `useReactionShortcodePicker` + `ReactionShortcodeSuggestPortal` (Arrow/Enter, cap 24, prefix then substring).
- Wired through `useCommentDraftEditor`, `CommentComposeBar` (single-line and multiline), `CommentThreadSection`, movie-card and feed-post detail pages.
- Entering comment edit loads the catalog and expands legacy tokens in `CommentListItem`; catalog failure leaves legacy markers.

Verification: `cd frontend && npm test` (156 passed, including parse + expand); `npm run lint` (no new issues); `npx tsc -b` passed. `vite build` failed in this environment (`registerHooks` / Cloudflare plugin), not due to these files.

Implementation remaining: feed compose / watch notes autocomplete (next task), closeout docs/PR.
