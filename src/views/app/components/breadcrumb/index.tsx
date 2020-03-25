'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { NavLink } from 'react-router-dom'

import { breadcrumbsRef } from '../breadcrumbs'

function getBreadcrumbs() {
  return breadcrumbsRef.current
}

export class Breadcrumb extends React.Component<
  {
    children: React.ReactNode
    to: string
  },
  { delimited: boolean }
> {
  element: HTMLSpanElement
  prevNodes: ChildNode[]

  constructor(props) {
    super(props)
    this.element = document.createElement('span')
    this.state = { delimited: false }
  }

  componentDidMount() {
    const breadcrumbs = getBreadcrumbs()

    const existingCrumbCount = breadcrumbs ? breadcrumbs.childNodes.length : 0
    this.setState({ delimited: existingCrumbCount > 0 })

    breadcrumbs && breadcrumbs.appendChild(this.element)
  }

  componentWillUnmount() {
    this.element.parentElement &&
      this.element.parentElement.removeChild(this.element)
  }

  render() {
    return ReactDOM.createPortal(
      <>
        {this.state.delimited ? ' / ' : null}
        {this.props.to ? (
          <NavLink to={this.props.to}>{this.props.children}</NavLink>
        ) : (
          this.props.children
        )}
      </>,
      this.element
    )
  }
}

export default Breadcrumb
