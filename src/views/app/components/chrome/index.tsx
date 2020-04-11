'use strict'

import React from 'react'

import { ResourceBreadcrumbs } from '../breadcrumb'
import { ResourceTitle } from '../title'

export const ResourceChrome = ({
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
      <ResourceTitle label={label} placeholder={placeholder} fn={fn} />
      <ResourceBreadcrumbs label={label} placeholder={placeholder} fn={fn} />
    </>
  )
}
