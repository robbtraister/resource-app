'use strict'

import React, { Suspense, useState, useEffect } from 'react'

import { Loading } from './components/loading'
import { wrapUser } from './user'

const LazyApp = React.lazy(() =>
  import(/* webpackChunkName: "main" */ './main')
)

const Login = () => <form>Login</form>

export const Entry = () => {
  const [users, setUsers] = useState(null)
  const user = users && users.find(user => user.me)

  useEffect(() => {
    window
      .fetch(`/api/v1/users`)
      .then(resp => resp.json())
      .then(({ users }) => {
        setUsers(users.map(wrapUser))
      })
  }, [])

  return users === undefined ? (
    <Loading />
  ) : user === undefined ? (
    <Login />
  ) : (
    <Suspense fallback={<Loading />}>
      <LazyApp user={user} users={users} />
    </Suspense>
  )
}

export default Entry
