'use strict'

import React, { useState } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import { Breadcrumb } from '../breadcrumb'

export const NoTrailingSwitch = ({
  children
}: {
  children?: React.ReactNode
}) => {
  const route = useRouteMatch()
  return (
    <Switch>
      <Route
        strict
        exact
        path={`${route.path}/`}
        render={() => <Redirect to={route.url.replace(/\/+$/, '')} />}
      />
      {children}
    </Switch>
  )
}

export const Index = ({
  breadcrumb,
  context,
  paramField,
  ListComponent,
  ShowComponent
}: {
  breadcrumb?: { to: string; label: string }
  context: React.Context<object[]>
  paramField: string
  ListComponent: React.ComponentType<{ setCollection?: Function }>
  ShowComponent: React.ComponentType
}) => {
  const route = useRouteMatch()
  const [collection, setCollection] = useState()

  return (
    <context.Provider value={collection}>
      {breadcrumb && (
        <Breadcrumb to={breadcrumb.to}>{breadcrumb.label}</Breadcrumb>
      )}
      <NoTrailingSwitch>
        <Route
          path={`${route.path}/:${paramField}`}
          component={ShowComponent}
        />
        <Route
          path={route.path}
          render={() => <ListComponent setCollection={setCollection} />}
        />
      </NoTrailingSwitch>
    </context.Provider>
  )
}

export default Index
