import { useContext } from 'react'

import { userContext, usersContext } from '../contexts/users'

export const useUsers = () => {
  return useContext(usersContext)
}

export const useUser = () => {
  return useContext(userContext)
}
