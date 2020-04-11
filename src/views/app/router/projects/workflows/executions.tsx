'use strict'

import React from 'react'
import { Resource, List } from 'react-router-resource'

import { ResourceBreadcrumbs } from '../../../components/breadcrumb'

import { ListExecutions } from '../../../resources/executions/list'

export const Executions = ({ path }: { path: string }) => (
  <Resource path={path}>
    <ResourceBreadcrumbs label="Executions" placeholder="Execution" />

    <List component={ListExecutions} />
  </Resource>
)

export default Executions
