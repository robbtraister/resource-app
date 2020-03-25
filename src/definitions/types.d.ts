interface Message {
  id?: string
  type: string
  error?: object
}

interface Options {
  app?: {
    fileLimit?: number
    id?: string
    title?: string
  }
  auth?: {
    cookie: string
    secret: string
    providers: {
      facebook?: object
      google?: object
    }
  }
  host?: string
  isProd?: boolean
  logging?: boolean
  port?: number
  projectRoot?: string
  ssr?: boolean
  workerCount?: number
}
