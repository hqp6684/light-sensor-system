import * as express from 'express';

export class App {
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    // this.middleware();
    this.routes();
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
       * working so far. This function will change when we start to add more
       * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get(
      '/',
      (
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        res.json({
          message: 'Hello World!'
        });
      }
    );
    this.express.use('/', router);
  }
}
