'use strict'

import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Client, Query, useClient } from 'react-router-resource'

import { Loading } from '../../components/loading'
import { useQueryParams } from '../../hooks/useQueryParams'

import { Dataset } from './model'
import { Resources } from '..'

export const ListDatasets = ({
  match,
  resources: { datasets }
}: {
  match: { url: string }
  resources: Resources
}) => {
  const history = useHistory()
  const query: Query = useQueryParams()
  const client: Client<Dataset> = useClient()

  return (
    <>
      <button
        onClick={() => {
          history.replace(
            `?${client.serializeQuery({
              ...query,
              desc: query.desc !== 'true',
              page: 1
            })}`
          )
        }}>
        reverse
      </button>
      {datasets ? (
        datasets.length ? (
          <ul>
            {datasets.map(dataset => (
              <li key={dataset.id}>
                <Link to={`${match.url}/${dataset.id}`}>{dataset.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>No Datasets</div>
        )
      ) : (
        <Loading />
      )}
    </>
  )
}

ListDatasets.displayName = 'Dataset.List'

export default ListDatasets
