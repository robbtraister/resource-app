'use strict'

import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Client, Query, useClient } from 'react-router-resource'

import { Loading } from '../../components/loading'
import { useQueryParams } from '../../hooks/useQueryParams'

import { Project } from './model'

export const ListProjects = ({
  match,
  resources: { projects, projects_meta: projectsMeta }
}: {
  match: { url: string }
  // eslint-disable-next-line camelcase
  resources: { projects?: Project[]; projects_meta?: object }
}) => {
  const history = useHistory()
  const query: Query = useQueryParams()
  const client: Client<Project> = useClient()

  const page = +(query.page || 1)

  const PrevComponent = page > 1 ? Link : 'span'
  const NextComponent = projects && projects.length === 5 ? Link : 'span'

  return (
    <>
      <button
        onClick={() => {
          history.replace(
            `?${client.serializeQuery({
              ...query,
              desc: query.desc !== 'true',
              page: 1
            })}`
          )
        }}>
        reverse
      </button>

      {projects ? (
        projects.length ? (
          <>
            <ul>
              {projects.map(project => (
                <li key={project.id}>
                  <Link to={`${match.url}/${project.id}`}>{project.name}</Link>
                </li>
              ))}
            </ul>

            <div style={{ width: '350px' }}>
              <div style={{ float: 'left' }}>
                <PrevComponent
                  to={`?${client.serializeQuery({
                    ...query,
                    page: page - 1
                  })}`}>
                  &lt; prev
                </PrevComponent>
              </div>

              <div style={{ float: 'right' }}>
                <NextComponent
                  to={`?${client.serializeQuery({
                    ...query,
                    page: page + 1
                  })}`}>
                  next &gt;
                </NextComponent>
              </div>
            </div>
          </>
        ) : (
          <div>No Projects</div>
        )
      ) : (
        <Loading />
      )}
    </>
  )
}

ListProjects.displayName = 'Project.List'

export default ListProjects
