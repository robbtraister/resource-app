'use strict'

import React from 'react'

import { Loading } from '../../components/loading'

import { Dataset } from './model'

export const ShowDataset = ({
  resources: { dataset }
}: {
  resources: { dataset?: Dataset }
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
