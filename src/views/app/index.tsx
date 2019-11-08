'use strict'

import PropTypes from 'prop-types'
import React from 'react'

import styles from './styles.scss'

class App extends React.Component {
  static propTypes: any;
  props: {
    user?: any
  }

  componentDidMount () {
    console.log('mounted!')
  }

  render () {
    const { user } = this.props
    const name = (user && user.name) || 'World'
    return <div className={styles.red}>Hello, {name}!</div>
  }
}

App.propTypes = {
  user: PropTypes.object,
  store: PropTypes.object
}

export default App
