'use strict'

import React from 'react'
import { Resource, Show } from 'react-router-resource'

import { ResourceChrome } from '../../../components/chrome'

import { ShowPredictor } from '../../../resources/predictors/show'

export const Predictors = ({ path }: { path: string }) => (
  <Resource path={path}>
    <ResourceChrome label="Predictors" placeholder="Predictor" />

    <Show exact component={ShowPredictor} />
  </Resource>
)

export default Predictors
