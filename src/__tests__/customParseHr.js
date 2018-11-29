import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'
import hr from './hr.json'

const parseBlock = (block, contentState) => {
  if (block.getType().toLowerCase() === 'atomic') {
    const entity = contentState.getEntity(block.getEntityAt(0))
    if (entity != null && entity.getType() === 'HR') {
      return document.createElement('hr')
    }
  }
}

describe('convertToHtml with custom parseBlock option', () => {
  test('converts hr with custom parseBlock function', () => {
    const html = convertToHtml(convertFromRaw(hr), { parseBlock })
    expect(html).toMatchSnapshot()
  })
})
