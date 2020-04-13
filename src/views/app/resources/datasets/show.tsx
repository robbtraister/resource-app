'use strict'

import React from 'react'

import { Loading } from '../../components/loading'

import { Resources } from '..'

export const ShowDataset = ({
  resources: { dataset }
}: {
  resources: Resources
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
