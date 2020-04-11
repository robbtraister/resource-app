'use strict'

import React from 'react'
import { Resource, Show } from 'react-router-resource'

import { ResourceBreadcrumbs } from '../../../components/breadcrumb'

import { ShowPredictor } from '../../../resources/predictors/show'

export const Predictors = ({ path }: { path: string }) => (
  <Resource path={path}>
    <ResourceBreadcrumbs label="Predictors" placeholder="Predictor" />

    <Show exact component={ShowPredictor} />
  </Resource>
)

export default Predictors
