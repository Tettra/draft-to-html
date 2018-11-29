import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'
import calloutBlock from './calloutBlock.json'

const parseBlock = (block, contentState) => {
  if (block.getType().toLowerCase() === 'callout') {
    const el = document.createElement('blockquote')
    return el
  }
}

describe('convertToHtml with custom parseBlock option', () => {
  test('converts calloutBlock with custom parseBlock function', () => {
    const html = convertToHtml(convertFromRaw(calloutBlock), { parseBlock })
    expect(html).toMatchSnapshot()
  })
})
