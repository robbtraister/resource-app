'use strict'

import React from 'react'

import styles from './styles.scss'

export const ObjectView = ({
  object,
  onClose
}: {
  object?: { name: string }
  onClose: Function
}) => {
  return (
    <div className={`${styles.panel} ${object ? styles.visible : ''}`}>
      {object ? object.name : ''}
      <button
        onClick={() => {
          onClose()
        }}>
        close
      </button>
    </div>
  )
}

export default ObjectView
