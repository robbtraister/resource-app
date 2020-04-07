'use strict'

import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { Loading } from '../../components/loading'
import { useQueryParams } from '../../hooks/useQueryParams'
import { IWorkflow, IParams } from '../../models/workflow'

export const ListWorkflows = ({
  match,
  resources: { workflows }
}: {
  match: { url: string }
  resources: { workflows?: IWorkflow[] }
}) => {
  const history = useHistory()
  const query: IParams = useQueryParams()

  return (
    <>
      <button
        onClick={() => {
          history.replace(`?desc=${query.desc !== 'true'}`)
        }}>
        reverse
      </button>
      {workflows ? (
        workflows.length ? (
          <ul>
            {workflows.map(project => (
              <li key={project.id}>
                <Link to={`${match.url}/${project.id}`}>{project.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>No workflows</div>
        )
      ) : (
        <Loading />
      )}
    </>
  )
}

ListWorkflows.displayName = 'Workflow.List'

export default ListWorkflows
