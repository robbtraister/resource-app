'use strict'

import React from 'react'
import {
  Link,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom'

import { workflowsContext, useWorkflows } from './context'
import { ShowWorkflow } from './show'

import { useProject } from '../../context'

import { Index } from '../../../../components/index/index'
import { Loading } from '../../../../components/loading'
import { useRequest } from '../../../../hooks/useRequest'

const ListWorkflows = ({
  setCollection: setWorkflows
}: {
  setCollection: Function
}) => {
  const route = useRouteMatch()
  const history = useHistory()
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  const desc = /^(true|on|1)$/.test(query.get('desc'))
  const sortBy = query.get('sortBy') || 'name'

  const project = useProject()
  const workflows = useWorkflows()

  useRequest(
    `/api/v1/projects/${project.id}/workflows?sortBy=${sortBy ||
      'name'}&desc=${desc || false}`,
    (err, { workflows }: { workflows?: object[] } = {}) => {
      err || setWorkflows(workflows)
    }
  )

  return (
    <div>
      <h2>Workflows</h2>

      {workflows ? (
        workflows.length ? (
          <>
            <button
              onClick={() => {
                history.push(`?sortBy=${sortBy}&desc=${!desc}`)
              }}>
              reverse
            </button>
            <ul>
              {workflows.map(workflow => (
                <li key={workflow.id}>
                  <Link to={`${route.url.replace(/\/+$/, '')}/${workflow.id}`}>
                    {workflow.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          `No Workflows found for project [${project.name}]`
        )
      ) : (
        <Loading />
      )}
    </div>
  )
}

export const WorkflowsIndex = () => {
  const { projectId } = useParams()

  return (
    <Index
      context={workflowsContext}
      paramField="workflowId"
      ListComponent={ListWorkflows}
      ShowComponent={ShowWorkflow}
      breadcrumb={{
        to: `/projects/${projectId}/workflows`,
        label: 'Workflows'
      }}
    />
  )
}

export default WorkflowsIndex
