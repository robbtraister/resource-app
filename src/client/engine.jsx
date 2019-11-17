'use strict'

/* global window, __DEFAULT_APP_ID__ */

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from '~/src/views/app'

let user
window.setUser = function setUser(u) {
  user = u
}

function render(
  Component,
  targetElement = document.getElementById(__DEFAULT_APP_ID__)
) {
  if (Component && targetElement) {
    const originalHTML = targetElement.innerHTML

    try {
      const props = {
        ...(window.__DATA__ || {}),
        user
      }

      ReactDOM.hydrate(
        <BrowserRouter>
          <Component {...props} />
        </BrowserRouter>,
        targetElement
      )
    } catch (e) {
      targetElement.innerHTML = originalHTML
      console.error(e)
    }
  }
}

window.document.addEventListener('DOMContentLoaded', () => {
  render(App)
})
