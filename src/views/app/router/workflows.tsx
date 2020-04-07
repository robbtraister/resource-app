'use strict'

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Resource, Show, List } from 'react-router-resource'

import { ResourceBreadcrumbs } from '../components/breadcrumb'

import { ListWorkflows } from '../pages/workflows/list'
import { ShowWorkflow } from '../pages/workflows/show'

import { Executions } from './executions'

export const Workflows = ({ path }: { path: string }) => (
  <Resource
    path={path}
    payloadName="entries"
    defaultQueryParams={{ page: 1, sortBy: 'name', desc: false }}>
    <ResourceBreadcrumbs label="Workflows" placeholder="Workflow" />

    <List component={ListWorkflows} />
    <Show exact component={ShowWorkflow} />

    <Show
      render={({ match }: { match: { url: string } }) => (
        <Switch>
          <Executions path={`${match.url}/executions`} />

          <Route render={() => <Redirect to={match.url} />} />
        </Switch>
      )}
    />
  </Resource>
)

export default Workflows
