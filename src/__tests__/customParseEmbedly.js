import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'
import embedly from './embedly.json'

const parseBlock = (block, contentState) => {
  if (block.getType().toLowerCase() === 'atomic') {
    const entity = contentState.getEntity(block.getEntityAt(0))
    if (entity != null && entity.getType() === 'EMBEDLY') {
      const { src } = entity.getData()
      const el = document.createElement('iframe')
      el.setAttribute('src', src)
      el.setAttribute('frameborder', 0)
      el.setAttribute('scrolling', 'no')
      el.setAttribute('allow', 'autoplay; fullscreen')
      return el
    }
  }
}

describe('convertToHtml with custom parseBlock option', () => {
  test('converts table', () => {
    const html = convertToHtml(convertFromRaw(embedly), { parseBlock })
    expect(html).toMatchSnapshot()
  })
})
