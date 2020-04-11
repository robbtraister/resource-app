'use strict'

import React from 'react'

import { Workflow } from './model'
import { ShowWorkflow } from './show'

export const NewWorkflow = () => {
  const workflow: Workflow = {
    name: 'my new workflow'
  }

  return <ShowWorkflow resources={{ workflow }} />
}

NewWorkflow.displayName = 'Workflow.New'

export default NewWorkflow
