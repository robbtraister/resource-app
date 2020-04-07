'use strict'

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Resource, Show, List } from 'react-router-resource'

import { ResourceBreadcrumbs } from './components/breadcrumb'

import { Home } from './pages/home'

import { ListProjects } from './pages/projects/list'
import { ShowProject } from './pages/projects/show'
import { ListDatasets } from './pages/datasets/list'
import { ShowDataset } from './pages/datasets/show'
import { ListExecutions } from './pages/executions/list'
import { ShowPredictor } from './pages/predictors/show'
import { ListWorkflows } from './pages/workflows/list'
import { ShowWorkflow } from './pages/workflows/show'

export const Router = () => (
  <Switch>
    {/**
     * Projects
     */}
    <Resource
      path="/projects"
      defaultQueryParams={{ page: 1, sortBy: 'name', desc: false }}>
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
              defaultQueryParams={{ page: 1, sortBy: 'name', desc: false }}>
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
              defaultQueryParams={{ page: 1, sortBy: 'name', desc: false }}>
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
