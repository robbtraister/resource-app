'use strict'

import React from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

import { Breadcrumbs } from './components/breadcrumbs'
import { Sidebar } from './components/sidebar'
import { SidebarContent } from './components/sidebar-content'

import { Home } from './pages/home'
// import { ProjectsIndex as Projects } from './pages/projects'
import Projects from './pages/projects'

import { userContext, usersContext } from './contexts/users'

import styles from './styles.scss'

export const App = ({ user, users }: { user: any; users: any[] }) => {
  return (
    <usersContext.Provider value={users}>
      <userContext.Provider value={user}>
        <BrowserRouter>
          <div className={styles.container}>
            <Sidebar />
            <SidebarContent>
              <Link to="/projects">Projects</Link>
            </SidebarContent>
            <div className={styles.main}>
              <Breadcrumbs />
              <Switch>
                <Route path="/projects" component={Projects} />
                <Route path="/" component={Home} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </userContext.Provider>
    </usersContext.Provider>
  )
}

export default App
