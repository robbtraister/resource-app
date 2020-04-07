'use strict'

import React from 'react'

import { Loading } from '../../components/loading'
import { IDataset } from '../../models/dataset'

export const ShowDataset = ({
  resources: { dataset }
}: {
  resources: { dataset?: IDataset }
}) => {
  return dataset ? (
    <>
      <h3>{dataset.name}</h3>
    </>
  ) : (
    <Loading />
  )
}

ShowDataset.displayName = 'Dataset.Show'

export default ShowDataset
