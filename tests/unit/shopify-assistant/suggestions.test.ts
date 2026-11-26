import { describe, expect, it } from 'vitest'
import { createSuggestionSplitter } from '@/lib/shopify-assistant/suggestions'

/** Streams `chunks` through a fresh splitter and returns what the shopper sees. */
function run(chunks: string[]) {
  const splitter = createSuggestionSplitter()
  let shown = ''
  for (const chunk of chunks) shown += splitter.push(chunk)
  shown += splitter.flush()
  return { shown, suggestions: splitter.suggestions() }
}

describe('createSuggestionSplitter', () => {
  it('passes plain answers through with no suggestions', () => {
    expect(run(['The SkyTrail ', 'comes in Navy and Grey.'])).toEqual({
      shown: 'The SkyTrail comes in Navy and Grey.',
      suggestions: [],
    })
  })

  it('keeps the ">>" line out of the answer and returns it as buttons', () => {
    expect(run(['Here are two options.\n>> Show more | Compare them | Backpacks?'])).toEqual({
      shown: 'Here are two options.',
      suggestions: ['Show more', 'Compare them', 'Backpacks?'],
    })
  })

  it('finds the marker even when it is split across chunks', () => {
    const result = run(['Here you go.\n', '>', '> Cabin sizes | Warranty'])
    expect(result.shown).toBe('Here you go.')
    expect(result.suggestions).toEqual(['Cabin sizes', 'Warranty'])
  })

  it('does not hold back a line break that turns out to be ordinary text', () => {
    const splitter = createSuggestionSplitter()
    expect(splitter.push('Line one\n')).toBe('Line one')
    expect(splitter.push('Line two')).toBe('\nLine two')
  })

  it('cleans, de-duplicates and caps the suggestions at three short ones', () => {
    const long = 'x'.repeat(61)
    const { suggestions } = run([
      'Answer.\n>> 1. **Show more** | [Warranty](/pages/warranty) | show more | ' + long + ' | - Sets | Extra',
    ])
    expect(suggestions).toEqual(['Show more', 'Warranty', 'Sets'])
  })
})
