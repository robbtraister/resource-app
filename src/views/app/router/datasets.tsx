'use strict'

import React from 'react'
import { Resource, Show, List } from 'react-router-resource'

import { ResourceBreadcrumbs } from '../components/breadcrumb'

import { ListDatasets } from '../pages/datasets/list'
import { ShowDataset } from '../pages/datasets/show'

export const Datasets = ({ path }: { path: string }) => (
  <Resource
    path={path}
    defaultQueryParams={{ page: 1, sortBy: 'name', desc: false }}>
    <ResourceBreadcrumbs label="Datasets" placeholder="Dataset" />

    <List component={ListDatasets} />
    <Show exact component={ShowDataset} />
  </Resource>
)

export default Datasets
