'use strict'

import React, { useState } from 'react'
import { Route, useParams, useRouteMatch } from 'react-router-dom'

import { ObjectView } from './components/object'
import { datasetContext, useDataset, useDatasets } from './context'

import { NoTrailingSwitch } from '../../../../components/index/index'
import { Show } from '../../../../components/show'

export const DetailDataset = () => {
  const dataset = useDataset()

  const [object, setObject] = useState(null)

  return (
    <>
      <h2>{dataset.name}</h2>

      <ul>
        <li>
          <a href="#" onClick={() => setObject({ name: 'one' })}>
            Object 1
          </a>
        </li>
        <li>
          <a href="#" onClick={() => setObject({ name: 'two' })}>
            Object 2
          </a>
        </li>
        <li>
          <a href="#" onClick={() => setObject({ name: 'three' })}>
            Object 3
          </a>
        </li>
      </ul>

      <ObjectView object={object} onClose={() => setObject(null)} />
    </>
  )
}

export const ShowDataset = () => {
  const route = useRouteMatch()
  const { datasetId } = useParams()

  const cachedDatasets = useDatasets()
  const cachedDataset =
    cachedDatasets && cachedDatasets.find(dataset => dataset.id === datasetId)

  return (
    <Show
      context={datasetContext}
      initialData={cachedDataset}
      unpack={({ dataset }) => dataset}>
      <NoTrailingSwitch>
        <Route path={route.path} component={DetailDataset} />
      </NoTrailingSwitch>
    </Show>
  )
}

export default ShowDataset
