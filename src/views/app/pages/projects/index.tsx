'use strict'

import React from 'react'
// import { useRouteMatch } from 'react-router-dom'

// import { Resource } from '../../components/resource'
import { Breadcrumb } from '../../components/breadcrumb'

import { ProjectsList } from './list'
import { ProjectsShow } from './show'
import { resource } from '../../utils/resource'
import { RouteComponentProps } from 'react-router-dom'

const ProjectNew = () => {
  return <div>New Project</div>
}

const ProjectsResource = resource({
  name: 'project',
  List: ProjectsList,
  Show: ProjectsShow,
  New: ProjectNew,
  defaultParams: { page: 1, sortBy: 'name', desc: false }
})

export const Projects = ({ match }: RouteComponentProps) => {
  return (
    <>
      <Breadcrumb to={match.url}>Projects</Breadcrumb>
      <ProjectsResource />
    </>
  )
}

export default Projects
