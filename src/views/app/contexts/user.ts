'use strict'

import { createContext, useContext } from 'react'

const userContext = createContext({ name: null })

function useUser() {
  return useContext(userContext)
}

export default userContext

export { useUser }
