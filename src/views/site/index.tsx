'use strict'

import PropTypes from 'prop-types'
import React from 'react'

import './styles.scss'

const Site = ({ title = '', App, Styles }) => (
  <html>
    <head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width" />
      <Styles />
    </head>
    <body>
      <App />
    </body>
  </html>
)

Site.propTypes = {
  title: PropTypes.string,
  App: PropTypes.elementType,
  Styles: PropTypes.elementType
}

export default Site
