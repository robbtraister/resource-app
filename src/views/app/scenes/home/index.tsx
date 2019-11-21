'use strict'

import React from 'react'

import styles from './styles.scss'

import { useUser } from '../../contexts/user'

const Home = () => {
  const user = useUser()

  return (
    <div className={styles.red}>Hello, {(user && user.name) || 'World!'}</div>
  )
}

export { Home }
