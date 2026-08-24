# Progress: colon-shortcode-markup

**Status:** `in_progress` (implementation **code complete**; tests + PR remaining)

## 2026-08-24T163000Z — closeout docs (code complete)

- Wrote `docs/features/colon-shortcode-markup.md` (syntax, spoilers, edit vs published, legacy tokens, catalog `shortcode`, canonicalize on write, surfaces, autocomplete, out of scope).
- Wrote `.cursor/active/colon-shortcode-markup/result.md` (implemented, files grouped by area, verification, limitations).
- Action-log fragment: `.cursor/memory/logs/2026-08-24T163000Z-colon-shortcode-markup-docs.md`.
- Code is done. Next: Docker `make backend-test`, CI Frontend `npm run build`, PR to `master`. Deploy stays `workflow_dispatch`.

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

## 2026-08-24 — feed compose / watch note / feed drafts autocomplete

- Wired `useReactionShortcodePicker` + `ReactionShortcodeSuggestPortal` into `FeedComposeSheet` (no `COMMENT_BODY_MAX_LEN`; mention wins keydown if open).
- Watch note in `CardFormFields` gets the same picker; legacy `⟦r` / `[[r` expand once when catalog loads (skip-self-write ref so typing is not overwritten).
- Feed inline comment drafts (`FeedCard`, `FeedPostCard`) use `COMMENT_BODY_MAX_LEN`; `EngagementCommentsRow` forwards shortcode portal props.
- `FeedPostCard` body edit expands legacy tokens on enter (same as `CommentListItem`) and hosts a shortcode picker on the edit field.

Verification: `npx eslint --max-warnings=0` on touched files passed; `npx tsc -b` passed.

Implementation remaining at that point: closeout docs/PR. Docs landed 2026-08-24T163000Z; tests + PR still open.
