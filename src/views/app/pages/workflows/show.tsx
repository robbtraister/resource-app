'use strict'

import React from 'react'

import { Loading } from '../../components/loading'
import { IWorkflow } from '../../models/workflow'

export const ShowWorkflow = ({
  resources: { workflow }
}: {
  resources: { workflow?: IWorkflow }
}) => {
  return workflow ? (
    <>
      <h3>{workflow.name}</h3>
    </>
  ) : (
    <Loading />
  )
}

ShowWorkflow.displayName = 'Workflow.Show'

export default ShowWorkflow
