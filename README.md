# draft-to-html

In progress

## Usage:

```jsx
import convertToHtml from 'draft-to-html'

...

convertToHtml(contentState, options)
```


### Options:

```js
{
  parseStyle: string => {
    nodeName: string,
    [attrName: string]: string
  },
  parseEntity: (entity: {
    type: DraftEntityType,
    mutability: DraftEntityMutability,
    data: ?{[key: string]: any},
  }) => {
    nodeName: string,
    [attrName: string]: string
  },
  parseBlock: ContentBlock => {
    nodeName: string,
    [attrName: string]: string
  }
}
```

* [ContentBlock](https://draftjs.org/docs/api-reference-content-block)
