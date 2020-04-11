'use strict'

import React from 'react'
import { Resource, List } from 'react-router-resource'

import { ResourceChrome } from '../../../components/chrome'

import { ListExecutions } from '../../../resources/executions/list'

export const Executions = ({ path }: { path: string }) => (
  <Resource path={path}>
    <ResourceChrome label="Executions" placeholder="Execution" />

    <List component={ListExecutions} />
  </Resource>
)

export default Executions
