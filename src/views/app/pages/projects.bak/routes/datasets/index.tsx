'use strict'

import React from 'react'
import {
  Link,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom'

import { datasetsContext, useDatasets } from './context'
import { ShowDataset } from './show'

import { useProject } from '../../context'

import { Index } from '../../../../components/index/index'
import { Loading } from '../../../../components/loading'
import { useRequest } from '../../../../hooks/useRequest'

const ListDatasets = ({
  setCollection: setDatasets
}: {
  setCollection: Function
}) => {
  const route = useRouteMatch()
  const history = useHistory()
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  const desc = /^(true|on|1)$/.test(query.get('desc'))
  const sortBy = query.get('sortBy') || 'name'

  const project = useProject()
  const datasets = useDatasets()

  useRequest(
    `/api/v1/projects/${project.id}/datasets?sortBy=${sortBy ||
      'name'}&desc=${desc || false}`,
    (err, { datasets }: { datasets?: object[] } = {}) => {
      err || setDatasets(datasets)
    }
  )

  return (
    <div>
      <h2>Datasets</h2>

      {datasets ? (
        datasets.length ? (
          <>
            <button
              onClick={() => {
                history.push(`?sortBy=${sortBy}&desc=${!desc}`)
              }}>
              reverse
            </button>{' '}
            <ul>
              {datasets.map(dataset => (
                <li key={dataset.id}>
                  <Link to={`${route.url.replace(/\/+$/, '')}/${dataset.id}`}>
                    {dataset.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          `No Datasets found for project [${project.name}]`
        )
      ) : (
        <Loading />
      )}
    </div>
  )
}

export const DatasetsIndex = () => {
  const { projectId } = useParams()

  return (
    <Index
      context={datasetsContext}
      paramField="datasetId"
      ListComponent={ListDatasets}
      ShowComponent={ShowDataset}
      breadcrumb={{
        to: `/projects/${projectId}/datasets`,
        label: 'Datasets'
      }}
    />
  )
}

export default DatasetsIndex
