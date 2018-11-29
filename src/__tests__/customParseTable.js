import { convertFromRaw } from 'draft-js'
import convertToHtml from '../'
import table from './table.json'

const parseBlock = (block, contentState) => {
  if (block.getType().toLowerCase() === 'atomic') {
    const entity = contentState.getEntity(block.getEntityAt(0))
    if (entity != null && entity.getType() === 'TABLE') {
      const { rows } = entity.getData()
      const tableEl = document.createElement('table')
      const tbodyEl = document.createElement('tbody')

      tableEl.appendChild(tbodyEl)

      rows.forEach(row => {
        const rowEl = document.createElement('tr')
        row.forEach(cell => {
          const tdEl = document.createElement('td')
          tdEl.innerHTML = convertToHtml(convertFromRaw(cell))
          rowEl.appendChild(tdEl)
        })
        tbodyEl.appendChild(rowEl)
      })

      return tableEl
    }
  }
}

describe('convertToHtml with custom parseBlock option', () => {
  test('converts table', () => {
    const html = convertToHtml(convertFromRaw(table), { parseBlock })
    expect(html).toMatchSnapshot()
  })
})
