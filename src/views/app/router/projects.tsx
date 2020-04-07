'use strict'

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Resource, Show, List } from 'react-router-resource'

import { ResourceBreadcrumbs } from '../components/breadcrumb'

import { ListProjects } from '../pages/projects/list'
import { ShowProject } from '../pages/projects/show'

import { Datasets } from './datasets'
import { Predictors } from './predictors'
import { Workflows } from './workflows'

export const Projects = ({ path }: { path: string }) => (
  <Resource
    path={path}
    defaultQueryParams={{ page: 1, sortBy: 'name', desc: false }}>
    <ResourceBreadcrumbs label="Projects" placeholder="Project" />

    <List component={ListProjects} />
    <Show exact component={ShowProject} />

    <Show
      render={({ match }: { match: { url: string } }) => (
        <Switch>
          <Datasets path={`${match.url}/datasets`} />
          <Predictors path={`${match.url}/predictors`} />
          <Workflows path={`${match.url}/workflows`} />

          <Route render={() => <Redirect to={match.url} />} />
        </Switch>
      )}
    />
  </Resource>
)

export default Projects
