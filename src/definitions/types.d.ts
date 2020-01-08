interface Message {
  id?: string
  type: string
  error?: object
}

interface Options {
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
  workerCount?: number
}
