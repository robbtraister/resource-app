'use strict'

import PropTypes from 'prop-types'
import React from 'react'

class App extends React.Component {
  static propTypes: any;

  componentDidMount () {
    console.log('mounted!')
  }

  render () {
    return <div>Hello, World!</div>
  }
}

App.propTypes = {
  user: PropTypes.object,
  store: PropTypes.object
}

export default App
