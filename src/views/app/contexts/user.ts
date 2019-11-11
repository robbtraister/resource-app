'use strict'

import { createContext, useContext } from 'react'

const userContext = createContext({ name: null })

function useUserContext () {
  return useContext(userContext)
}

export default userContext

export { useUserContext }
