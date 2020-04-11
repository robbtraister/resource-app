'use strict'

import React from 'react'
import { Redirect, Route, Switch, useParams } from 'react-router'
import { Resource, Show, List, New } from 'react-router-resource'

import { ResourceChrome } from '../../../components/chrome'

import { WorkflowsClient } from '../../../resources/workflows/model'
import { ListWorkflows } from '../../../resources/workflows/list'
import { NewWorkflow } from '../../../resources/workflows/new'
import { ShowWorkflow } from '../../../resources/workflows/show'

import { Executions } from './executions'

export const Workflows = ({ path }: { path: string }) => {
  const { project_id: projectId } = useParams()
  return (
    <Resource
      path={path}
      client={WorkflowsClient.fromProject(projectId as string)}>
      <ResourceChrome label="Workflows" placeholder="Workflow" />

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

      <New component={NewWorkflow} />
    </Resource>
  )
}

export default Workflows
