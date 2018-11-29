import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'
import mentions from './mentions.json'

const ENTITY_TYPE = {
    AUDIO: 'AUDIO',
    EMBEDLY: 'EMBEDLY',
    FILE: 'FILE',
    GITHUB_ISSUE: 'GITHUB-ISSUE',
    GOOGLE_DOC: 'GOOGLE-DOC',
    IFRAME: 'IFRAME',
    IMAGE: 'IMAGE',
    LINK: 'LINK',
    MENTION: 'MENTION',
    PAGE_REFERENCE: 'PAGE-REFERENCE',
    VIDEO: 'VIDEO',
    HR: 'HR',
    TABLE: 'TABLE',
};


const parseEntity = (entity) => {
  // eslint-disable-next-line
  const { url, display_name, title } = entity.data

  if (['PAGE-REFERENCE', 'GITHUB-ISSUE', 'GOOGLE-DOC'].includes(entity.type)) {
    const el = document.createElement('A')
    el.setAttribute('title', title)
    el.setAttribute('href', url)
    return el
  } else if (entity.type === 'MENTION') {
    const el = document.createElement('A')
    el.setAttribute('title', display_name)
    el.setAttribute('href', url)
    return el
  }
}

describe.only('convertToHtml with custom parseBlock option', () => {
  test('converts mentions with custom parseBlock function', () => {
    const html = convertToHtml(convertFromRaw(mentions), { parseEntity })
    expect(html).toMatchSnapshot()
  })
})
