// @flow

const blockTypes = {
  'header-one': 'H1',
  'header-two': 'H2',
  'header-three': 'H3',
  'header-four': 'H4',
  'header-five': 'H5',
  'header-six': 'H6',
  'unordered-list-item': 'LI',
  'ordered-list-item': 'LI',
  'blockquote': 'BLOCKQUOTE',
  'code-block': 'PRE',
  'unstyled': 'P',
  'paragraph': 'P'
}

const inlineStyleTags = {
  'BOLD': 'strong',
  'CODE': 'code',
  'ITALIC': 'em',
  'STRIKETHROUGH': 'strike',
  'UNDERLINE': 'u'
}

const listElements = {
  'unordered-list-item': 'UL',
  'ordered-list-item': 'OL'
}

const parseEntity = (entity, options = {}) => {
  let customParsed = null
  let parsed = null

  if (entity.type.toUpperCase() === 'LINK' &&
    entity.data != null &&
    entity.data.src != null) {
    parsed = document.createElement('A')
    parsed.setAttribute('href', entity.data.src)
  }

  if (options.parseEntity != null) {
    customParsed = options.parseEntity(entity)
    if (customParsed != null) {
      parsed = customParsed
    }
  }

  return parsed
}

const parseStyle = (style, options = {}) => {
  let element = document.createElement(inlineStyleTags[style.toUpperCase()] || 'span')
  if (options.parseStyle != null) {
    element = options.parseStyle(style) || element
  }

  return element
}

const getCharacterRanges = block => {
  return block.characterList.reduce((ranges, characterData, index) => {
    const lastRange = ranges.slice(-1)[0]

    if (lastRange != null && lastRange.characterData.equals(characterData)) {
      lastRange.length++
      return ranges
    } else {
      return [
        ...ranges,
        {
          offset: index,
          length: 1,
          characterData
        }
      ]
    }
  }, [])
}

const appendTextFragments = (block, element, contentState, options = {}) => {
  const text = block.getText()

  if (block.getType().toLowerCase() === 'atomic') {
    return
  }

  const characterRanges = getCharacterRanges(block)

  characterRanges.forEach(({
    offset,
    length,
    characterData
  }) => {
    const start = offset
    const end = offset + length
    const { style } = characterData
    const entity = characterData.entity != null ? contentState.getEntity(characterData.entity) : null

    // console.log('text', text.slice(start, end))
    // console.log('characterData', characterData)
    // console.log('start', start, 'end', end)

    let innerText = document.createTextNode(text.slice(start, end))

    if (style != null && style.size > 0) {
      style.forEach(style => {
        const parsedStyle = parseStyle(style)
        if (parsedStyle != null) {
          parsedStyle.appendChild(innerText)
          innerText = parsedStyle
        }
      })
    }

    if (entity != null) {
      const parsedEntity = parseEntity(entity, options)

      if (parsedEntity != null) {
        parsedEntity.appendChild(innerText)
        innerText = parsedEntity
      }
    }

    element.appendChild(innerText)
  })
}

const parseBlock = (block, contentState, options = {}) => {
  let customParsed = null
  let parsed = { nodeName: blockTypes[block.getType()] || 'P' }

  if (options.parseBlock != null) {
    customParsed = options.parseBlock(block, contentState)
    if (customParsed != null) {
      parsed = customParsed
    }
  }

  return parsed
}

const convertToHtml = (contentState, options = {}) => {
  const blocks = contentState.getBlocksAsArray()
  const root = document.createElement('body')

  blocks.forEach(block => {
    const { nodeName, ...attrs } = parseBlock(block, contentState, options)
    const element = document.createElement(nodeName)

    Object.keys(attrs).forEach(attr => {
      element.setAttribute(attr, attrs[attr])
    })

    appendTextFragments(block, element, contentState, options)

    if (block.getType().includes('ordered-list-item')) {
      if (root.lastChild == null || listElements[block.getType()] !== root.lastChild.nodeName) {
        root.appendChild(document.createElement(listElements[block.getType()]))
      }

      root.lastChild.appendChild(element)
    } else {
      root.appendChild(element)
    }
  })

  return root.innerHTML
}

export default convertToHtml
