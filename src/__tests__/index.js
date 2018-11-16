import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'

describe('convertToHtml', () => {
  test('converts unstyled blocks', () => {
    const rawContent = {
      blocks: [{
        text: 'One'
      }, {
        text: 'Two'
      }],
      entityMap: {}
    }
    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })

  test('converts unordered list', () => {
    const rawContent = {
      blocks: [{
        type: 'unordered-list-item',
        text: 'One'
      }, {
        type: 'unordered-list-item',
        text: 'Two'
      }],
      entityMap: {}
    }
    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })

  test('converts ordered list', () => {
    const rawContent = {
      blocks: [{
        type: 'ordered-list-item',
        text: 'One'
      }, {
        type: 'ordered-list-item',
        text: 'Two'
      }],
      entityMap: {}
    }
    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })

  test('converts adjacent unordered and ordered list', () => {
    const rawContent = {
      blocks: [{
        type: 'unordered-list-item',
        text: 'One'
      }, {
        type: 'ordered-list-item',
        text: 'Two'
      }],
      entityMap: {}
    }
    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })

  test('converts headers', () => {
    const rawContent = {
      blocks: [{
        type: 'header-one',
        text: 'Header'
      }, {
        type: 'header-two',
        text: 'Header'
      }, {
        type: 'header-three',
        text: 'Header'
      }, {
        type: 'header-four',
        text: 'Header'
      }, {
        type: 'header-five',
        text: 'Header'
      }, {
        type: 'header-six',
        text: 'Header'
      }],
      entityMap: {}
    }
    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })

  test('converts block quotes', () => {
    const rawContent = {
      blocks: [{
        type: 'blockquote',
        text: 'Simon says let the blockquote speak'
      }],
      entityMap: {}
    }

    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })

  test('converts code blocks', () => {
    const rawContent = {
      blocks: [{
        type: 'code-block',
        text: 'Simon says let the code block speak'
      }],
      entityMap: {}
    }

    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })

  test('converts inline styles', () => {
    const rawContent = {
      blocks: [{
        text: 'Simon says let the code block speak',
        inlineStyleRanges: [
          { style: 'bold', offset: 0, length: 8 }
        ],
        entityRanges: [
          { key: '1', offset: 0, length: 3 }
        ]
      }],
      entityMap: {
        '1': {
          type: 'LINK',
          data: {
            src: 'https://placekitten.com/400/300'
          }
        }
      }
    }

    const html = convertToHtml(convertFromRaw(rawContent))
    expect(html).toMatchSnapshot()
  })
})
