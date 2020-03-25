'use strict'

import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Breadcrumb } from '../../../components/breadcrumb'
import { Loading } from '../../../components/loading'

import { IDataset } from './interfaces'

export const DatasetsShow = ({ dataset }: { dataset?: IDataset }) => {
  const match = useRouteMatch()
  return dataset ? (
    <>
      <Breadcrumb to={match.url}>{dataset.name}</Breadcrumb>
      <h3>{dataset.name}</h3>
    </>
  ) : (
    <Loading />
  )
}

DatasetsShow.displayName = 'Datasets.Show'

export default DatasetsShow
