'use strict'

import React from 'react'

import { Resources } from '..'

export const ShowPredictor = ({ predictor }: Resources) =>
  predictor ? <div>{predictor.name}</div> : null

ShowPredictor.displayName = 'Predictor.Show'

export default ShowPredictor
