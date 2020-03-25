'use strict'

import React, { createContext, useContext, useState } from 'react'
import {
  Route,
  Switch,
  // useHistory,
  // useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom'

import { useQueryParams } from '../hooks/useQueryParams'
import { useRequest } from '../hooks/useRequest'

interface IName {
  singular: string
  plural: string
}
type Name = string | IName

const defaultEndpointFn = ({ prefix = '/api/v1', params = {} }) => (
  { id, ...filter }: { [key: string]: string },
  match
) => {
  const base = `${prefix}${match.url}`
  if (id) {
    return base
  }

  const query = Object.keys(params)
    .sort()
    .map(key => `${key}=${key in filter ? filter[key] : params[key]}`)
    .join('&')

  return `${base}?${query}`
}

export function resource<T extends { id: string }>({
  name,
  apiPrefix,
  defaultParams,
  List,
  Show,
  New,
  Edit
}: {
  name: Name
  apiPrefix?: string
  defaultParams?: object
  List: React.ComponentType<any>
  Show: React.ComponentType<any>
  New?: React.ComponentType<any>
  Edit?: React.ComponentType<any>
}) {
  const cacheContext = createContext(null)

  const singular: string = (name as IName).singular || `${name}`
  const plural: string =
    (name as IName).plural || `${singular.replace(/y$/, 'ie')}s`
  const idField = `${singular}Id`

  const endpointFn = defaultEndpointFn({
    prefix: apiPrefix,
    params: defaultParams
  })

  const CacheShow = routeProps => {
    const { cache = [] } = useContext(cacheContext)
    const { [idField]: id } = useParams()

    const cachedItem = cache.find(object => object.id === id)
    const [item, setItem] = useState(cachedItem)

    useRequest(
      endpointFn({ id }, routeProps.match),
      (err, { [singular]: data } = {}) => {
        if (err) {
          // setError(err)
        } else {
          setItem(data || item)
        }
      }
    )

    const props = {
      [singular]: item
    }

    return <Show {...routeProps} {...props} />
  }
  CacheShow.displayName = `Resource<${singular}>.Show`

  const CacheList = routeProps => {
    const { cache, setCache } = useContext(cacheContext)
    const query = useQueryParams()

    const uri = endpointFn(query, routeProps.match)
    useRequest(uri, (err, { [plural]: data } = {}) => {
      if (err) {
        // setError(err)
      } else {
        setCache(data)
      }
    })

    const props = {
      [plural]: cache
    }

    return <List {...routeProps} {...props} />
  }
  CacheList.displayName = `Resource<${singular}>.List`

  function Resource({ children }: { children?: React.ReactNode }) {
    const match = useRouteMatch()
    const [cache, setCache] = useState()

    return (
      <cacheContext.Provider value={{ cache, setCache }}>
        <Switch>
          {New && <Route path={`${match.path}/new`} component={New} />}
          {Edit && (
            <Route path={`${match.path}/:${idField}/edit`} component={Edit} />
          )}
          <Route path={`${match.path}/:${idField}`} component={CacheShow} />
          <Route path={match.path} component={CacheList} />
        </Switch>
        {children}
      </cacheContext.Provider>
    )
  }

  return Resource
}

export default resource
