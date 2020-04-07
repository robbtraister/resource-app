'use strict'

import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Client } from 'react-router-resource'

import { Loading } from '../../components/loading'
import { useQueryParams } from '../../hooks/useQueryParams'
import { IProject, IParams } from '../../models/project'

export const ListProjects = ({
  match,
  resources: { projects }
}: {
  match: { url: string }
  resources: { projects?: IProject[] }
}) => {
  const history = useHistory()
  const query: IParams = useQueryParams()

  const page = +(query.page || 1)

  return (
    <>
      <button
        onClick={() => {
          history.replace(`?desc=${query.desc !== 'true'}`)
        }}>
        reverse
      </button>

      {projects ? (
        <>
          <ul>
            {projects.map(project => (
              <li key={project.id}>
                <Link to={`${match.url}/${project.id}`}>{project.name}</Link>
              </li>
            ))}
          </ul>

          <div style={{ width: '300px ' }}>
            {page > 1 && (
              <Link
                style={{ float: 'left' }}
                to={`?${Client.serializeParams({ ...query, page: page - 1 })}`}>
                &lt; prev
              </Link>
            )}

            {projects.length === 5 && (
              <Link
                style={{ float: 'right' }}
                to={`?${Client.serializeParams({ ...query, page: page + 1 })}`}>
                next &gt;
              </Link>
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  )
}

ListProjects.displayName = 'Project.List'

export default ListProjects
