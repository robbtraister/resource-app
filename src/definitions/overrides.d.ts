declare module 'cluster' {
  interface ClusterSettings {
    workerCount?: number
  }
}

declare namespace Express {
  interface Request {
    csrfToken?: Function
    user?: object
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'styled-components': any
  }
}

interface SVGAnimateTransformElement {
  beginElement: Function
}
