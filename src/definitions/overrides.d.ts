declare namespace Express {
  export interface Request {
    csrfToken?: Function
    user?: object
  }
}
