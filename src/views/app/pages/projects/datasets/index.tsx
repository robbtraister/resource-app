'use strict'

import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Resource } from '../../../components/resource'
import { Breadcrumb } from '../../../components/breadcrumb'

import { DatasetsList } from './list'
import { DatasetsShow } from './show'

export const Datasets = () => {
  const match = useRouteMatch()

  return (
    <Resource
      name="dataset"
      List={DatasetsList}
      Show={DatasetsShow}
      defaultParams={{ page: 1, sortBy: 'name', desc: false }}>
      <Breadcrumb to={match.url}>Datasets</Breadcrumb>
    </Resource>
  )
}

export default Datasets
