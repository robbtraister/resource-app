'use strict'

import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Breadcrumb } from '../../../components/breadcrumb'
import { Loading } from '../../../components/loading'

import { IWorkflow } from './interfaces'

export const WorkflowsShow = ({ workflow }: { workflow?: IWorkflow }) => {
  const match = useRouteMatch()
  return workflow ? (
    <>
      <Breadcrumb to={match.url}>{workflow.name}</Breadcrumb>
      <h3>{workflow.name}</h3>
    </>
  ) : (
    <Loading />
  )
}

WorkflowsShow.displayName = 'Workflows.Show'

export default WorkflowsShow
