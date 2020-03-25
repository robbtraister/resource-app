'use strict'

import React, { createRef, RefObject } from 'react'

export const breadcrumbsRef: RefObject<HTMLDivElement> = createRef()

export const Breadcrumbs = () => {
  return <div ref={breadcrumbsRef} />
}

export default Breadcrumbs
