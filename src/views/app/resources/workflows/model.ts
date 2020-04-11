import { Client } from 'react-router-resource'

import { projectsClient } from '../projects/model'

export interface Workflow {
  id?: string
  name: string
}

const workflowsQuery = {
  sortBy: 'name',
  desc: false
}

export class WorkflowsClient extends Client<Workflow> {
  static fromEndpoint(endpoint: string) {
    return Client.getInstance<Workflow>({
      endpoint,
      defaultQuery: workflowsQuery,
      name: 'entries'
    })
  }

  static fromProject(projectId: string) {
    return this.fromEndpoint(
      `${projectsClient.endpoint}/${projectId}/workflows`
    )
  }
}
