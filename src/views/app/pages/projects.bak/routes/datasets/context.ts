'use strict'

import { createContext, useContext } from 'react'

export const datasetsContext = createContext(null)
export const datasetContext = createContext(null)

export const useDatasets = () => {
  return useContext(datasetsContext)
}

export const useDataset = () => {
  return useContext(datasetContext)
}
