import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'
import fileBlock from './fileBlock.json'

const parseBlock = (block, contentState) => {
  if (block.getType().toLowerCase() === 'atomic') {
    const entity = contentState.getEntity(block.getEntityAt(0))
    if (entity != null && entity.getType() === 'FILE') {
      const { name, src } = entity.getData()
      const el = document.createElement('a')

      el.setAttribute('href', src)
      el.setAttribute('alt', name)
      el.textContent = name
      return el
    }
  }
}

describe('convertToHtml with custom parseBlock option', () => {
  test('converts fileBlock with custom parseBlock function', () => {
    const html = convertToHtml(convertFromRaw(fileBlock), { parseBlock })
    expect(html).toMatchSnapshot()
  })
})
