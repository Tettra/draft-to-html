import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'
import image from './image.json'

const parseBlock = (block, contentState) => {
  if (block.getType().toLowerCase() === 'atomic') {
    const entity = contentState.getEntity(block.getEntityAt(0))
    if (entity != null && entity.getType() === 'IMAGE') {
      const { src } = entity.getData()
      const el = document.createElement('img')

      el.setAttribute('href', src)
      el.setAttribute('alt', name)
      el.textContent = name
      return el
    }
  }
}

describe('convertToHtml with custom parseBlock option', () => {
  test('converts image with custom parseBlock function', () => {
    const html = convertToHtml(convertFromRaw(image), { parseBlock })
    expect(html).toMatchSnapshot()
  })
})
