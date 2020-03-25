'use strict'

import React from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'

import { Datasets } from './datasets'
import { Workflows } from './workflows'
import { Breadcrumb } from '../../components/breadcrumb'
import { Loading } from '../../components/loading'

import { IProject } from './interfaces'

export const ProjectsShow = ({ project }: { project?: IProject }) => {
  const match = useRouteMatch()

  return project ? (
    <>
      <Breadcrumb to={match.url}>{project.name}</Breadcrumb>
      <Switch>
        <Route path={`${match.path}/datasets`} component={Datasets} />
        <Route path={`${match.path}/workflows`} component={Workflows} />
        <Route path={match.path}>
          <h3>{project.name}</h3>
          <ul>
            <li>
              <Link to={`${match.url}/datasets`}>Datasets</Link>
            </li>
            <li>
              <Link to={`${match.url}/workflows`}>Workflows</Link>
            </li>
          </ul>
        </Route>
      </Switch>
    </>
  ) : (
    <Loading />
  )
}

ProjectsShow.displayName = 'Projects.Show'

export default ProjectsShow
