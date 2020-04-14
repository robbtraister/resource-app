import { RefreshClient } from '../refresh-client'

import { projectsClient } from '../projects/model'

export interface Workflow {
  id?: string
  name: string
}

const workflowsQuery = {
  sortBy: 'name',
  desc: false
}

export class WorkflowsClient extends RefreshClient<Workflow> {
  static fromEndpoint(endpoint: string) {
    return RefreshClient.getInstance<Workflow>({
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
