'use strict'

import { createContext, useContext } from 'react'

const storeContext = createContext({})

function useStore() {
  return useContext(storeContext)
}

export default storeContext

export { useStore }
