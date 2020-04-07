'use strict'

import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { Loading } from '../../components/loading'
import { useQueryParams } from '../../hooks/useQueryParams'
import { IDataset, IParams } from '../../models/dataset'

export const ListDatasets = ({
  match,
  resources: { datasets }
}: {
  match: { url: string }
  resources: { datasets?: IDataset[] }
}) => {
  const history = useHistory()
  const query: IParams = useQueryParams()

  return (
    <>
      <button
        onClick={() => {
          history.replace(`?desc=${query.desc !== 'true'}`)
        }}>
        reverse
      </button>
      {datasets ? (
        datasets.length ? (
          <ul>
            {datasets.map(project => (
              <li key={project.id}>
                <Link to={`${match.url}/${project.id}`}>{project.name}</Link>
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
