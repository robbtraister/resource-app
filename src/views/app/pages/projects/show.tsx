'use strict'

import React from 'react'
import { Link } from 'react-router-dom'

import { Loading } from '../../components/loading'
import { IProject } from '../../models/project'

export const ShowProject = ({
  match,
  resources: { project }
}: {
  match: { url: string }
  resources: { project?: IProject }
}) => {
  return project ? (
    <>
      <h3>{project.name}</h3>
      <ul>
        <li>
          <Link to={`${match.url}/datasets`}>Datasets</Link>
        </li>
        <li>
          <Link to={`${match.url}/workflows`}>Workflows</Link>
        </li>
      </ul>
    </>
  ) : (
    <Loading />
  )
}

ShowProject.displayName = 'Project.Show'

export default ShowProject
