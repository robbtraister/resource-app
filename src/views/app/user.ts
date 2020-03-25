'use strict'

export function wrapUser(user) {
  const requestCache = {}

  user.request = (uri: string, cb?: Function): Promise<any> => {
    if (!uri) {
      return cb()
    }

    if (!(uri in requestCache)) {
      requestCache[uri] = { id: 0 }
    }
    const { id, data } = requestCache[uri]
    const thisId = (requestCache[uri].id = id + 1)

    cb && cb(null, data)

    const result = window
      .fetch(uri)
      .then(resp => resp.json())
      .then(payload => {
        if (thisId >= requestCache[uri].id) {
          requestCache[uri].data = payload
          cb && cb(null, payload)
        }
        return payload
      })
      .catch(err => {
        if (thisId >= requestCache[uri].id) {
          if (cb) {
            cb(err)
          } else {
            throw err
          }
        }
      })

    if (!cb) {
      return result
    }
  }

  return user
}
