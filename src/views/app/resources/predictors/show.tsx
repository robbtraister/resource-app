'use strict'

import React from 'react'

import { IPredictor } from './model'

export const ShowPredictor = ({ predictor }: { predictor: IPredictor }) => (
  <div>{predictor.name}</div>
)

ShowPredictor.displayName = 'Predictor.Show'

export default ShowPredictor
