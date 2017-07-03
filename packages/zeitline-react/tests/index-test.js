import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import Zeitline from 'src/'

describe('Zeitline', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('have a svg node', () => {
    render(<Zeitline/>, node, () => {
      expect(node.innerHTML).toContain('svg')
    })
  })
})
