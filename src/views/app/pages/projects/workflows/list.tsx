'use strict'

import React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'

import { useQueryParams } from '../../../hooks/useQueryParams'
import { Loading } from '../../../components/loading'

import { IWorkflow, IParams } from './interfaces'

export const WorkflowsList = ({ workflows }: { workflows?: IWorkflow[] }) => {
  const history = useHistory()
  const match = useRouteMatch()
  const query: IParams = useQueryParams()

  return workflows ? (
    <>
      <button
        onClick={() => {
          history.replace(`?desc=${query.desc !== 'true'}`)
        }}>
        reverse
      </button>
      <ul>
        {workflows.map(project => (
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

WorkflowsList.displayName = 'Workflows.List'

export default WorkflowsList
