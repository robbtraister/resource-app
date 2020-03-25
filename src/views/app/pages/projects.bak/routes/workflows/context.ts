'use strict'

import { createContext, useContext } from 'react'

export const workflowsContext = createContext(null)
export const workflowContext = createContext(null)

export const useWorkflows = () => {
  return useContext(workflowsContext)
}

export const useWorkflow = () => {
  return useContext(workflowContext)
}
