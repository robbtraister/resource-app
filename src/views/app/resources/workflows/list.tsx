'use strict'

import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Client, Query, useClient } from 'react-router-resource'

import { Loading } from '../../components/loading'
import { useQueryParams } from '../../hooks/useQueryParams'

import { Workflow } from './model'
import { Resources } from '..'

export const ListWorkflows = ({
  match,
  resources: { workflows }
}: {
  match: { url: string }
  resources: Resources
}) => {
  const history = useHistory()
  const query: Query = useQueryParams()
  const client: Client<Workflow> = useClient()

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
      {workflows ? (
        <>
          {workflows.length ? (
            <ul>
              {workflows.map(workflow => (
                <li key={workflow.id}>
                  <Link to={`${match.url}/${workflow.id}`}>
                    {workflow.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>No Workflows</div>
          )}
          <Link to={`${match.url}/new`}>Create Workflow</Link>
        </>
      ) : (
        <Loading />
      )}
    </>
  )
}

ListWorkflows.displayName = 'Workflow.List'

export default ListWorkflows
