'use strict'

import React from 'react'
import { Link, Route, useParams, useRouteMatch } from 'react-router-dom'

import { projectContext, useProject, useProjects } from './context'

import { DatasetsIndex } from './routes/datasets'
import { WorkflowsIndex } from './routes/workflows'

import { NoTrailingSwitch } from '../../components/index/index'
import { Show } from '../../components/show'
import { SidebarContent } from '../../components/sidebar-content'

export const DetailProject = () => {
  const route = useRouteMatch()

  const project = useProject()

  return (
    <>
      <h2>{project.name}</h2>

      <div>
        <Link to={`${route.url}/datasets`}>Datasets</Link>
      </div>
      <div>
        <Link to={`${route.url}/workflows`}>Workflows</Link>
      </div>
    </>
  )
}

export const ShowProject = () => {
  const route = useRouteMatch()
  const { projectId } = useParams()

  const cachedProjects = useProjects()
  const cachedProject =
    cachedProjects && cachedProjects.find(project => project.id === projectId)

  return (
    <Show
      context={projectContext}
      initialData={cachedProject}
      unpack={({ project }) => project}>
      <SidebarContent>
        <Link to={route.url}>Project</Link>: <Link to={route.url}>abc</Link>
        <ul>
          <li>
            <Link to={`${route.url}/datasets`}>Datasets</Link>
          </li>
          <li>
            <Link to={`${route.url}/workflows`}>Workflows</Link>
          </li>
        </ul>
      </SidebarContent>
      <NoTrailingSwitch>
        <Route path={`${route.path}/datasets`} component={DatasetsIndex} />
        <Route path={`${route.path}/workflows`} component={WorkflowsIndex} />
        <Route path={route.path} component={DetailProject} />
      </NoTrailingSwitch>
    </Show>
  )
}

export default ShowProject
