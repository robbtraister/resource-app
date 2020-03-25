'use strict'

import React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'

import { useQueryParams } from '../../../hooks/useQueryParams'
import { Loading } from '../../../components/loading'

import { IDataset, IParams } from './interfaces'

export const DatasetsList = ({ datasets }: { datasets?: IDataset[] }) => {
  const history = useHistory()
  const match = useRouteMatch()
  const query: IParams = useQueryParams()

  return datasets ? (
    <>
      <button
        onClick={() => {
          history.replace(`?desc=${query.desc !== 'true'}`)
        }}>
        reverse
      </button>
      <ul>
        {datasets.map(project => (
          <li key={project.id}>
            <Link to={`${match.url}/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <Loading />
  )
}

DatasetsList.displayName = 'Datasets.List'

export default DatasetsList
