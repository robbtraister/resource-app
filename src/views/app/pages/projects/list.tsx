'use strict'

import React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'

import { useQueryParams } from '../../hooks/useQueryParams'
import { Loading } from '../../components/loading'

import { IProject, IParams } from './interfaces'

export const ProjectsList = ({ projects }: { projects?: IProject[] }) => {
  const history = useHistory()
  const match = useRouteMatch()
  const query: IParams = useQueryParams()

  return projects ? (
    <>
      <button
        onClick={() => {
          history.replace(`?desc=${query.desc !== 'true'}`)
        }}>
        reverse
      </button>

      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`${match.url}/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <Loading />
  )
}

ProjectsList.displayName = 'Projects.List'

export default ProjectsList
