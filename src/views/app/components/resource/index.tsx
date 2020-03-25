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

import { useQueryParams } from '../../hooks/useQueryParams'
import { useRequest } from '../../hooks/useRequest'

const resourceContext = createContext(null)

const CacheShow = () => {
  const { idField, cache = [], singular, endpointFn, Show } = useContext(
    resourceContext
  )
  const match = useRouteMatch()
  const { [idField]: id } = useParams()

  const cachedItem = cache.find(object => object.id === id)
  const [item, setItem] = useState(cachedItem)

  useRequest(endpointFn({ id }, match), (err, { [singular]: data } = {}) => {
    if (err) {
      // setError(err)
    } else {
      setItem(data || item)
    }
  })

  const props = {
    [singular]: item
  }

  return <Show {...props} />
}
CacheShow.displayName = 'Resource.Show'

const CacheList = () => {
  const { cache, plural, endpointFn, List, setCache } = useContext(
    resourceContext
  )
  const match = useRouteMatch()
  const query = useQueryParams()

  const uri = endpointFn(query, match)
  useRequest(uri, (err, { [plural]: data } = {}) => {
    if (err) {
      // setError(err)
    } else {
      setCache(data)
    }
  })

  const listProps = {
    [plural]: cache
  }

  return <List {...match} {...listProps} />
}
CacheList.displayName = 'Resource.List'

const defaultEndpointFn = ({ prefix = '/api/v1', params = {} }) => (
  { id, ...filter },
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

interface IName {
  singular: string
  plural: string
}

export function Resource<T extends { id: string }>({
  children,
  name,
  apiPrefix,
  defaultParams,
  List,
  Show,
  New,
  Edit
}: {
  children?: React.ReactNode
  name: string | IName
  apiPrefix?: string
  defaultParams?: object
  List: React.ComponentType<any>
  Show: React.ComponentType<any>
  New?: React.ComponentType<any>
  Edit?: React.ComponentType<any>
}) {
  const singular: string = (name as IName).singular || `${name}`
  const plural: string =
    (name as IName).plural || `${singular.replace(/y$/, 'ie')}s`
  const idField = `${singular}Id`

  const match = useRouteMatch()

  const [cache, setCache] = useState()

  const endpointFn = defaultEndpointFn({
    prefix: apiPrefix,
    params: defaultParams
  })

  const context = {
    idField,
    cache,
    setCache,
    singular,
    plural,
    endpointFn,
    List,
    Show,
    New
  }

  return (
    <resourceContext.Provider value={context}>
      <Switch>
        {New && <Route path={`${match.path}/new`} component={New} />}
        {Edit && (
          <Route path={`${match.path}/:${idField}/edit`} component={Edit} />
        )}
        <Route path={`${match.path}/:${idField}`} component={CacheShow} />
        <Route path={match.path} component={CacheList} />
      </Switch>
      {children}
    </resourceContext.Provider>
  )
}

Resource.List = CacheList
Resource.Show = CacheShow

export default Resource
