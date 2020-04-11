import { Client } from 'react-router-resource'

export class Project {
  readonly id: string
  readonly name: string

  constructor(props) {
    Object.assign(this, props)
  }
}

const projectsQuery = {
  page: 1,
  perPage: 5,
  sortBy: 'name',
  desc: false
}

export const projectsClient = Client.getInstance<Project>({
  getModel: payload => new Project(payload),
  endpoint: '/api/v1/projects',
  defaultQuery: projectsQuery
})
