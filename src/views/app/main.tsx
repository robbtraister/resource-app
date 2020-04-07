'use strict'

import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import { ApiPrefix } from 'react-router-resource'

import { Breadcrumbs } from './components/breadcrumbs'
import { Sidebar } from './components/sidebar'
import { SidebarContent } from './components/sidebar-content'

import { Router } from './router'

import { userContext, usersContext } from './contexts/users'

import styles from './styles.scss'

export const App = ({ user, users }: { user: any; users: any[] }) => {
  return (
    <usersContext.Provider value={users}>
      <userContext.Provider value={user}>
        <ApiPrefix value="/api/v1">
          <BrowserRouter>
            <div className={styles.container}>
              <Sidebar />
              <SidebarContent>
                <Link to="/projects">Projects</Link>
              </SidebarContent>
              <div className={styles.main}>
                <Breadcrumbs />
                <Router />
              </div>
            </div>
          </BrowserRouter>
        </ApiPrefix>
      </userContext.Provider>
    </usersContext.Provider>
  )
}

export default App
