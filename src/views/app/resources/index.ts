import { Dataset } from './datasets/model'
// import { Execution } from './executions/model'
import { Predictor } from './predictors/model'
import { Project } from './projects/model'
import { Workflow } from './workflows/model'

type ResourceType<Model, Singular extends string, Plural extends string> =
  | ({
      [S in Singular]?: Model | undefined
    } &
      {
        [P in Plural]?: undefined
      })
  | ({
      [S in Singular]?: undefined
    } &
      {
        [P in Plural]?: Model[] | undefined
      })

type DatasetResource = ResourceType<Dataset, 'dataset', 'datasets'>
type PredictorResource = ResourceType<Predictor, 'predictor', 'predictors'>
type ProjectResource = ResourceType<Project, 'project', 'projects'>
type WorkflowResource = ResourceType<Workflow, 'workflow', 'workflows'>

export { Dataset, Predictor, Project, Workflow }

export type Resources = DatasetResource &
  PredictorResource &
  ProjectResource &
  WorkflowResource
