'use strict'

import React from 'react'
import { Resource, Show, List } from 'react-router-resource'

import { ResourceBreadcrumbs } from '../../../components/breadcrumb'

import { datasetsQuery } from '../../../resources/datasets/model'
import { ListDatasets } from '../../../resources/datasets/list'
import { ShowDataset } from '../../../resources/datasets/show'

export const Datasets = ({ path }: { path: string }) => {
  return (
    <Resource path={path} defaultQuery={datasetsQuery}>
      <ResourceBreadcrumbs label="Datasets" placeholder="Dataset" />

      <List component={ListDatasets} />
      <Show exact component={ShowDataset} />
    </Resource>
  )
}

export default Datasets
