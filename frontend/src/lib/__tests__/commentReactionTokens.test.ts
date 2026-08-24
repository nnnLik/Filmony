import { describe, expect, it } from 'vitest'

import {
  reactionTokenForInsert,
  reactionTokenFromId,
  reactionTokenFromShortcode,
  splitCommentTextIntoSegments,
} from '../commentReactionTokens'

describe('reactionTokenFromShortcode', () => {
  it('wraps a catalog name in colons', () => {
    expect(reactionTokenFromShortcode('gasp')).toBe(':gasp:')
  })
})

describe('reactionTokenForInsert', () => {
  it('prefers shortcode when provided', () => {
    expect(reactionTokenForInsert(12, 'gasp')).toBe(':gasp:')
  })

  it('falls back to legacy id token', () => {
    expect(reactionTokenForInsert(12, undefined)).toBe(reactionTokenFromId(12))
  })
})

describe('splitCommentTextIntoSegments', () => {
  it('maps known :gasp: to a reaction id when catalog map is provided', () => {
    const map = new Map<string, number>([['gasp', 12]])
    expect(splitCommentTextIntoSegments('wow :gasp: nice', map)).toEqual([
      { type: 'text', value: 'wow ' },
      { type: 'reaction', reactionTypeId: 12 },
      { type: 'text', value: ' nice' },
    ])
  })

  it('keeps unknown :foo: as text', () => {
    const map = new Map<string, number>([['gasp', 12]])
    expect(splitCommentTextIntoSegments('hello :foo: there', map)).toEqual([
      { type: 'text', value: 'hello :foo: there' },
    ])
  })

  it('does not treat 10:30: as a reaction token', () => {
    const map = new Map<string, number>([['gasp', 12]])
    expect(splitCommentTextIntoSegments('see you at 10:30: ok', map)).toEqual([
      { type: 'text', value: 'see you at 10:30: ok' },
    ])
  })

  it('still matches legacy unicode reaction tokens', () => {
    expect(splitCommentTextIntoSegments('вау ⟦r12⟧ класс')).toEqual([
      { type: 'text', value: 'вау ' },
      { type: 'reaction', reactionTypeId: 12 },
      { type: 'text', value: ' класс' },
    ])
  })

  it('does not match :gasp: as a reaction without a catalog map', () => {
    expect(splitCommentTextIntoSegments('wow :gasp: nice')).toEqual([
      { type: 'text', value: 'wow :gasp: nice' },
    ])
  })
})
