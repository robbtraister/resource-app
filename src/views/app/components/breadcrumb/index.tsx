'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { useRouteMatch } from 'react-router'
import { NavLink } from 'react-router-dom'
import { Show, useConfig } from 'react-router-resource'

import { breadcrumbsRef } from '../breadcrumbs'

function getBreadcrumbs() {
  return breadcrumbsRef.current
}

export class Breadcrumb extends React.Component<
  {
    children: React.ReactNode
    to: string
    prefix?: string
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
        {this.state.delimited ? this.props.prefix || ' / ' : null}
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

const ListBreadcrumb = ({ children }: { children: React.ReactNode }) => {
  const match = useRouteMatch()

  return <Breadcrumb to={match.url}>{children}</Breadcrumb>
}

const ShowBreadcrumb = ({
  placeholder,
  fn = obj => obj.name
}: {
  placeholder: string
  fn?: (object) => string
}) => {
  const {
    name: { singular }
  } = useConfig()

  return (
    <Show
      render={({
        match,
        resources
      }: {
        match: { url: string }
        resources: object
      }) => (
        <Breadcrumb to={match.url}>
          {(singular && resources[singular] && fn(resources[singular])) ||
            placeholder}
        </Breadcrumb>
      )}
    />
  )
}

export const ResourceBreadcrumbs = ({
  label,
  placeholder,
  fn
}: {
  label: string
  placeholder: string
  fn?: (object) => string
}) => {
  return (
    <>
      <ListBreadcrumb>{label}</ListBreadcrumb>
      <ShowBreadcrumb placeholder={placeholder} fn={fn} />
    </>
  )
}

export default Breadcrumb
