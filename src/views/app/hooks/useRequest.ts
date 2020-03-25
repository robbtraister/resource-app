'use strict'

import { useEffect } from 'react'

import { useUser } from './useUsers'

export const useRequest = (uri: string, cb?: Function) => {
  const user = useUser()

  useEffect(() => {
    let mounted = true

    user.request(uri, (err, data) => {
      if (mounted) {
        cb && cb(err, data)
      }
    })

    return () => {
      mounted = false
    }
  }, [uri, user])
}

export default useRequest
