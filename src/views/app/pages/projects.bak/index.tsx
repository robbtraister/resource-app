'use strict'

import React from 'react'
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { projectsContext, useProjects } from './context'
import { ShowProject } from './show'

import { Index } from '../../components/index/index'
import { Loading } from '../../components/loading'
import { useRequest } from '../../hooks/useRequest'

const ListProjects = ({
  setCollection: setProjects
}: {
  setCollection: Function
}) => {
  const route = useRouteMatch()
  const history = useHistory()
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  const desc = /^(true|on|1)$/.test(query.get('desc'))
  const sortBy = query.get('sortBy') || 'name'

  const projects = useProjects()

  useRequest(
    `/api/v1/projects?sortBy=${sortBy || 'name'}&desc=${desc || false}`,
    (err, { projects }: { projects?: object[] } = {}) => {
      err || setProjects(projects)
    }
  )

  return (
    <div>
      <h2>Projects</h2>

      {projects ? (
        <>
          <button
            onClick={() => {
              history.push(`?sortBy=${sortBy}&desc=${!desc}`)
            }}>
            reverse
          </button>
          <ul>
            {projects.map(project => (
              <li key={project.id}>
                <Link to={`${route.url.replace(/\/+$/, '')}/${project.id}`}>
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export const ProjectsIndex = () => {
  return (
    <Index
      context={projectsContext}
      paramField="projectId"
      ListComponent={ListProjects}
      ShowComponent={ShowProject}
      breadcrumb={{ to: '/projects', label: 'Projects ' }}
    />
  )
}

export default ProjectsIndex
