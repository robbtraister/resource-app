'use strict'

import { createContext, useContext } from 'react'

export const projectsContext = createContext(null)
export const projectContext = createContext(null)

export const useProjects = () => {
  return useContext(projectsContext)
}

export const useProject = () => {
  return useContext(projectContext)
}
