'use strict'

import { createContext } from 'react'

export const usersContext = createContext<any[] | undefined>(undefined)
export const userContext = createContext<object | undefined>(undefined)
