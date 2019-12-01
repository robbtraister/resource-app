declare module 'cluster' {
  export interface ClusterSettings {
    workerCount?: number
  }
}

declare namespace Express {
  export interface Request {
    csrfToken?: Function
    user?: object
  }
}
