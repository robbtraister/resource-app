interface Options {
  auth?: {
    cookie: string;
    secret: string;
    providers: {
      facebook?: object;
      google?: object;
    }
  };
  host?: string;
  isProd?: boolean;
  port?: number;
  projectRoot?: string;
  workerCount?: number;
}
