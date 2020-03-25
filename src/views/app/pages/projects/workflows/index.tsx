'use strict'

import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Resource } from '../../../components/resource'
import { Breadcrumb } from '../../../components/breadcrumb'

import { WorkflowsShow } from './show'
import { WorkflowsList } from './list'

export const Workflows = () => {
  const match = useRouteMatch()

  return (
    <Resource
      name="workflow"
      List={WorkflowsList}
      Show={WorkflowsShow}
      defaultParams={{ page: 1, sortBy: 'name', desc: false }}>
      <Breadcrumb to={match.url}>Workflows</Breadcrumb>
    </Resource>
  )
}

export default Workflows
