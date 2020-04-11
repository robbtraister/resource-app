'use strict'

import React from 'react'
import { List, Show, useConfig } from 'react-router-resource'

export const Title = ({ title }: { title: string }) => {
  document.title = title
  return null
}

const ShowTitle = ({
  placeholder,
  fn = obj => obj.name
}: {
  placeholder: string
  fn?: (object) => string
}) => {
  const {
    name: { singular }
  } = useConfig()

  return (
    <Show
      exact
      render={({ resources }: { resources: object }) => (
        <Title
          title={
            (singular && resources[singular] && fn(resources[singular])) ||
            placeholder
          }
        />
      )}
    />
  )
}

export const ResourceTitle = ({
  label,
  placeholder,
  fn
}: {
  label: string
  placeholder: string
  fn?: (object) => string
}) => {
  return (
    <>
      <List>
        <Title title={label} />
      </List>
      <ShowTitle placeholder={placeholder} fn={fn} />
    </>
  )
}

export default Title
