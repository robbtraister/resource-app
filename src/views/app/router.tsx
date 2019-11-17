'use strict'

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import Home from './scenes/home'

const GoHome = () => <Redirect to="/home" />

const Router = () => (
  <Switch>
    <Route path="/home" component={Home} />
    <Route path="/" component={GoHome} />
  </Switch>
)

export default Router
