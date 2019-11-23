'use strict'

/* global __AUTHENTICATED__ */

import { createContext, useContext } from 'react'

const userContext = createContext({ name: null })

function useUser() {
  return __AUTHENTICATED__ ? useContext(userContext) : null
}

export default userContext

export { useUser }
