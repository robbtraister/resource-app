'use strict'

import React from 'react'
import { Route, useParams, useRouteMatch } from 'react-router-dom'

import { workflowContext, useWorkflow, useWorkflows } from './context'

import { NoTrailingSwitch } from '../../../../components/index/index'
import { Show } from '../../../../components/show'

export const DetailWorkflow = () => {
  const workflow = useWorkflow()

  return (
    <>
      <h2>{workflow.name}</h2>
    </>
  )
}

export const ShowWorkflow = () => {
  const route = useRouteMatch()
  const { workflowId } = useParams()

  const cachedWorkflows = useWorkflows()
  const cachedWorkflow =
    cachedWorkflows &&
    cachedWorkflows.find(workflow => workflow.id === workflowId)

  return (
    <Show
      context={workflowContext}
      initialData={cachedWorkflow}
      unpack={({ workflow }) => workflow}>
      <NoTrailingSwitch>
        <Route path={route.path} component={DetailWorkflow} />
      </NoTrailingSwitch>
    </Show>
  )
}

export default ShowWorkflow
