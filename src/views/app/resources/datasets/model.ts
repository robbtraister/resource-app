// import { Client } from 'react-router-resource'

// import { projectsClient } from './project'

export interface Dataset {
  id: string
  name: string
}

export const datasetsQuery = {
  sortBy: 'name',
  desc: false
}

// export class DatasetsClient extends Client<Dataset> {
//   static fromEndpoint(endpoint: string) {
//     return Client.getInstance<Dataset>({
//       endpoint,
//       defaultQuery: {
//         page: 1,
//         perPage: 20,
//         desc: false
//       },
//       name: 'datasets'
//     })
//   }

//   static fromProject(projectId: string) {
//     return this.fromEndpoint(`${projectsClient.endpoint}/${projectId}/datasets`)
//   }
// }
