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
  let parsed = { }

  if (entity.type.toUpperCase() === 'LINK' &&
    entity.data != null &&
    entity.data.src != null) {
    parsed = {
      nodeName: 'A',
      href: entity.data.src
    }
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
  let customParsed = null
  let parsed = { nodeName: inlineStyleTags[style.toUpperCase()] || 'span' }
  if (options.parseStyle != null) {
    customParsed = options.parseStyle(style)
    if (customParsed != null) {
      parsed = customParsed
    }
  }

  return parsed
}

const appendTextFragments = (block, element, contentState, options = {}) => {
  let range = {}
  const text = block.getText()

  block.findStyleRanges(
    (_range) => {
      range = _range.toJS()
      if (range.entity != null) {
        range.entity = contentState.getEntity(range.entity).toJS()
      }
      return true
    },
    (start, end) => {
      let innerText = document.createTextNode(text.slice(start, end))

      if (range.style != null && range.style.length > 0) {
        range.style.forEach(style => {
          const parsedStyle = parseStyle(style)
          if (parsedStyle != null) {
            const { nodeName } = parsedStyle
            const styleEl = document.createElement(nodeName)
            styleEl.appendChild(innerText)
            innerText = styleEl
          }
        })
      }

      if (range.entity != null) {
        const parsedEntity = parseEntity(range.entity, options)

        if (parsedEntity != null) {
          const { nodeName, ...attrs } = parsedEntity
          const entityEl = document.createElement(nodeName)
          Object.keys(attrs).forEach(attr => {
            entityEl.setAttribute(attr, attrs[attr])
          })
          entityEl.appendChild(innerText)
          innerText = entityEl
        }
      }

      element.appendChild(innerText)
    }
  )
}

const convertToHtml = (contentState, options = {}) => {
  const blocks = contentState.getBlocksAsArray()
  const root = document.createElement('body')

  blocks.forEach(block => {
    const elementType = blockTypes[block.getType()] || 'P'

    const element = document.createElement(elementType)

    appendTextFragments(block, element, contentState)

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
