# Result — colon-shortcode-markup

Status: **in_progress** (code complete 2026-08-24T163000Z; tests + PR still open)

## Implemented

- Catalog reactions use readable `:shortcode:` (no spaces). Known complete tokens render as the reaction image in published view and in the composer overlay; incomplete or unknown names stay readable text.
- Spoilers use Discord-style `||text||`. Draft overlay keeps markers and inner text visible; published view uses `SpoilerRevealBlock`.
- Legacy `⟦r{id}⟧` / `[[r{id}]]` and `⟦S⟧…⟦/S⟧` still parse on read. Write path canonicalizes reactions to `:shortcode:` and spoilers to `||…||`.
- `GET /api/reactions/catalog` exposes `shortcode`. Picker insert, colon autocomplete, and edit-mode expand of legacy reaction ids use that field.
- Surfaces: comments, feed post bodies, and watch notes (shared `CommentDraftMirrorField` / `CommentBodyWithReactionTokens` paths).
- Unknown `:foo:` stays literal (not 422). Unknown legacy `⟦r{id}⟧` still fails write: comments **422**, feed post body **400**.

## Changed files

### Backend — model, migration, catalog

- `backend/src/models/reaction_type.py`
- `backend/src/migrations/versions/k1l2m3n4o567_reaction_type_shortcode.py`
- `backend/src/api/reactions/schemas.py`
- `backend/src/api/reactions/routes.py`
- `backend/src/services/reactions/list_reaction_catalog.py`
- `fixtures/reaction_type.sql`
- `scripts/upload_reactions_to_rustfs.py`

### Backend — rewrite and write canonicalize

- `backend/src/services/text/reaction_shortcodes.py`
- `backend/src/services/text/spoiler_tokens.py`
- `backend/src/services/cards/comment_reaction_tokens.py`
- `backend/src/services/feed_posts/validate_feed_post_body.py`
- `backend/src/services/cards/create_user_card.py`
- `backend/src/services/cards/create_planned_user_card.py`
- `backend/src/services/cards/update_user_card.py`
- `backend/src/services/watchlist/create_watchlist_entry.py`
- `backend/src/services/watchlist/update_watchlist_entry.py`

### Backend — tests

- `backend/src/tests/unit/services/test_reaction_shortcodes.py`
- `backend/src/tests/unit/services/test_spoiler_tokens.py`
- `backend/src/tests/unit/services/cards/test_comment_reaction_tokens.py`
- `backend/src/tests/unit/services/feed_posts/test_validate_feed_post_body.py`
- `backend/src/tests/unit/api/reactions/test_catalog_schema.py`
- `backend/src/tests/integration/api/test_reactions_routes.py`
- `backend/src/tests/integration/api/test_cards_routes.py`
- `backend/src/tests/integration/api/test_feed_posts_routes.py`

### Frontend — parsers, picker, overlay

- `frontend/src/api/profileTypes.ts`
- `frontend/src/lib/commentReactionTokens.ts`
- `frontend/src/lib/commentShortcodeCompose.ts`
- `frontend/src/lib/spoilerTokens.ts`
- `frontend/src/lib/__tests__/commentReactionTokens.test.ts`
- `frontend/src/lib/__tests__/commentShortcodeCompose.test.ts`
- `frontend/src/lib/__tests__/spoilerTokens.test.ts`
- `frontend/src/hooks/useReactionShortcodePicker.ts`
- `frontend/src/hooks/useCommentDraftEditor.ts`
- `frontend/src/components/comments/ReactionShortcodeSuggestPortal.tsx`
- `frontend/src/components/comments/CommentBodyWithReactionTokens.tsx`
- `frontend/src/components/comments/CommentReactionTokenPicker.tsx`

### Frontend — surfaces

- `frontend/src/components/comments/CommentComposeBar.tsx`
- `frontend/src/components/comments/CommentThreadSection.tsx`
- `frontend/src/components/comments/CommentListItem.tsx`
- `frontend/src/components/create/CardFormFields.tsx`
- `frontend/src/components/feed/EngagementCommentsRow.tsx`
- `frontend/src/components/feed/FeedCard.tsx`
- `frontend/src/components/feed/FeedComposeSheet.tsx`
- `frontend/src/components/feed/FeedPostCard.tsx`
- `frontend/src/components/reactions/reactionStrip/ReactionStripPopover.tsx`
- `frontend/src/pages/MovieCardDetailPage.tsx`
- `frontend/src/pages/FeedPostDetailPage.tsx`

### Docs / memory (this closeout)

- `docs/features/colon-shortcode-markup.md`
- `.cursor/active/colon-shortcode-markup/progress.md`
- `.cursor/memory/logs/2026-08-24T163000Z-colon-shortcode-markup-docs.md`

## Verification

Intended (Docker-first):

```bash
cd frontend && npm run lint && npm run test && npm run build
make backend-lint && make backend-format && make backend-test
```

Ran in this cloud agent (host venv; Docker unavailable):

- `cd frontend && npm test` — 156 passed (parse `:ga` / `10:30` / closing `:gasp:`; expand `⟦r12⟧` → `:gasp:`; pipe spoilers).
- `cd frontend && npm run lint` — no new issues on touched files.
- `cd frontend && npx tsc -b` — passed.
- `ruff check` + `ruff format --check` on touched backend files — passed.
- `pytest -n0 --no-cov` for comment/feed-post validator + shortcode helper units — 25 passed.
- Integration HTTP tests (Postgres) — **not run**.
- `vite build` — **not completed** (`registerHooks` / Cloudflare plugin on this Node image).

## Limitations

- Docker Compose backend suite was unavailable in this cloud agent; integration coverage is in the tree but unexecuted here.
- Production **Deploy** is GitHub Actions `workflow_dispatch` on `master`; merge does not start a deploy.
- Unknown feed-post legacy reaction token is **400**, not 422 (`FeedPostBodyValidationError`). Comments still return **422** for the same unknown `⟦r{id}⟧`. Unknown `:foo:` is accepted as literal text on both surfaces.
- Mentions, card-refs, bio, watch-party chat, share-to-Telegram HTML, atomic chip backspace, and bulk SQL rewrite of old `⟦r{id}⟧` rows are out of scope.

## Next steps

- Run `make backend-test` (unit + integration) inside Docker and `cd frontend && npm run build` in CI Frontend.
- Open PR to `master`; after green **CI Frontend** and **CI Backend**, merge; then Actions → Deploy when checks on `master` are green.
