'use strict'

import PropTypes from 'prop-types'
import React from 'react'

import Router from './router'

import storeContext from './contexts/store'
import userContext from './contexts/user'

const App = ({ user, store }) => (
  <userContext.Provider value={user}>
    <storeContext.Provider value={store}>
      <Router />
    </storeContext.Provider>
  </userContext.Provider>
)

App.propTypes = {
  user: PropTypes.any,
  store: PropTypes.any
}

export default App
