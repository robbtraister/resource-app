'use strict'

import React, { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Breadcrumb } from '../breadcrumb'
import { Loading } from '../loading'

import { useRequest } from '../../hooks/useRequest'

export const Show = ({
  context,
  children,
  initialData,
  unpack = x => x
}: {
  context: React.Context<object>
  children?: React.ReactNode
  initialData?: any
  unpack?: Function
}) => {
  const route = useRouteMatch()

  const [data, setData] = useState(initialData)
  const [error, setError] = useState()

  useRequest(`/api/v1${route.url}`, (err, payload) => {
    if (err) {
      return setError(err)
    }

    if (payload) {
      return setData(unpack(payload))
    }
  })

  return (
    <context.Provider value={data}>
      {error ? (
        <div>{error}</div>
      ) : data ? (
        <>
          <Breadcrumb to={route.url}>{data.name}</Breadcrumb>
          {children}
        </>
      ) : (
        <Loading />
      )}
    </context.Provider>
  )
}

export default Show
