'use strict'

import React from 'react'

import styles from './styles.scss'

import { useUserContext } from '../../contexts/user'

const Home = () => {
  const user = useUserContext()

  return (
    <div className={styles.red}>Hello, {(user && user.name) || 'World!'}</div>
  )
}

export default Home
