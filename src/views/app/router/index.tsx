'use strict'

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { Home } from '../pages/home'

import { Projects } from './projects'

export const Router = () => (
  <Switch>
    <Projects path="/projects" />

    <Route exact path="/" component={Home} />

    <Route render={() => <Redirect to="/" />} />
  </Switch>
)
