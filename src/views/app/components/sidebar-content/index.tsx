'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import { sidebarRef } from '../sidebar'

function getSidebar() {
  return sidebarRef.current
}

export class SidebarContent extends React.Component<{
  children: React.ReactNode
}> {
  element: HTMLDivElement
  prevNodes: ChildNode[]

  constructor(props) {
    super(props)
    this.element = document.createElement('div')
  }

  componentDidMount() {
    const sidebar = getSidebar()

    this.prevNodes = sidebar ? Array.from(sidebar.childNodes) : []
    this.prevNodes.forEach(node => node.parentElement.removeChild(node))

    sidebar && sidebar.appendChild(this.element)
  }

  componentWillUnmount() {
    this.element.parentElement &&
      this.element.parentElement.removeChild(this.element)

    const sidebar = getSidebar()
    sidebar && this.prevNodes.forEach(node => sidebar.appendChild(node))
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.element)
  }
}

export default SidebarContent
