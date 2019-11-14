'use strict'

import PropTypes from 'prop-types'
import React from 'react'

import Router from './router'

import userContext from './contexts/user'

const App = ({ user, store }) => (
  <userContext.Provider value={user}>
    <Router />
  </userContext.Provider>
)

App.propTypes = {
  user: PropTypes.any,
  store: PropTypes.any
}

export default App
