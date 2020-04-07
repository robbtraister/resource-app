'use strict'

import React from 'react'

import { IPredictor } from '../../models/predictor'

export const ShowPredictor = ({ predictor }: { predictor: IPredictor }) => (
  <div>{predictor.name}</div>
)

ShowPredictor.displayName = 'Predictor.Show'

export default ShowPredictor
