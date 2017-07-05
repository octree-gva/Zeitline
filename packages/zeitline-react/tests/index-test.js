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

  it('have two events', () => {
    render(<Zeitline data={[
      {date: new Date('30 Jun 2017'), label: 'first'},
      {date: new Date('10 Jul 2017'), label: 'second'},
    ]}/>, node, () => {
      expect(node.querySelectorAll('.event-group').length).toEqual(2)
    })
  })

  it('have no more svg node', () => {
    render(<Zeitline/>, node, () => {
      unmountComponentAtNode(node);
      expect(node.innerHTML).toEqual('')
    })
  })
})
