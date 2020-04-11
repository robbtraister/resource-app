'use strict'

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Resource, Show, List, New } from 'react-router-resource'

import { ResourceBreadcrumbs } from './components/breadcrumb'

import { Home } from './pages/home'

import { ListProjects } from './resources/projects/list'
import { ShowProject } from './resources/projects/show'
import { ListDatasets } from './resources/datasets/list'
import { ShowDataset } from './resources/datasets/show'
import { ListExecutions } from './resources/executions/list'
import { ShowPredictor } from './resources/predictors/show'
import { ListWorkflows } from './resources/workflows/list'
import { ShowWorkflow } from './resources/workflows/show'
import NewWorkflow from './resources/workflows/new'

export const Router = () => (
  <Switch>
    {/**
     * Projects
     */}
    <Resource
      path="/projects"
      defaultQuery={{ page: 1, perPage: 5, sortBy: 'name', desc: false }}>
      <ResourceBreadcrumbs label="Projects" placeholder="Project" />
      <List component={ListProjects} />
      <Show exact component={ShowProject} />

      <Show
        render={({ match }: { match: { url: string } }) => (
          <Switch>
            {/**
             * Datasets
             */}
            <Resource
              path={`${match.url}/datasets`}
              defaultQuery={{ sortBy: 'name', desc: false }}>
              <ResourceBreadcrumbs label="Datasets" placeholder="Dataset" />
              <List component={ListDatasets} />
              <Show exact component={ShowDataset} />
            </Resource>

            {/**
             * Predictors
             */}
            <Resource path={`${match.url}/predictors`}>
              <ResourceBreadcrumbs label="Predictors" placeholder="Predictor" />
              <Show exact component={ShowPredictor} />
            </Resource>

            {/**
             * Workflows
             */}
            <Resource
              path={`${match.url}/workflows`}
              payloadName="entries"
              defaultQuery={{ sortBy: 'name', desc: false }}>
              <ResourceBreadcrumbs label="Workflows" placeholder="Workflow" />
              <List component={ListWorkflows} />
              <Show exact component={ShowWorkflow} />

              <Show
                render={({ match }: { match: { url: string } }) => (
                  <Switch>
                    {/**
                     * Executions
                     */}
                    <Resource path={`${match.url}/executions`}>
                      <ResourceBreadcrumbs
                        label="Executions"
                        placeholder="Execution"
                      />
                      <List component={ListExecutions} />
                    </Resource>

                    {/**
                     * Catch
                     */}
                    <Route render={() => <Redirect to={match.url} />} />
                  </Switch>
                )}
              />

              <New component={NewWorkflow} />
            </Resource>

            {/**
             * Catch
             */}
            <Route render={() => <Redirect to={match.url} />} />
          </Switch>
        )}
      />
    </Resource>
    <Route exact path="/" component={Home} />

    {/**
     * Catch
     */}
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)
