import * as express from 'express';

import { Noble } from './noble';
import { SensorTags } from './st';

import * as path from 'path';

let st = require('sensortag');

export class App {
  public express: express.Application;
  private noble: Noble;
  private sensorTagCtl: SensorTags;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    // this.middleware();
    this.routes();

    // this.initSensorTags();

    this.onExit();
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
        // res.sendFile(path.join(__dirname, '/pages/index.html'));
        // console.log(path.join(__dirname, 'pages'));
        res.sendFile('index.html', { root: path.join(__dirname, '/pages') });
        // res.json({
        //   message: 'Hello World!'
        // });
      }
    );
    this.express.use('/', router);
  }

  // private initNoble() {
  //   this.noble = new Noble();
  // }

  private async initSensorTags() {
    console.log('Initializing SensorTags');
    this.sensorTagCtl = new SensorTags();
    await this.sensorTagCtl.connectAndSetUp();
    this.setupRoutes();
  }

  private setupRoutes() {}

  private onExit() {
    process.on('SIGINT', () => {
      console.log('Exiting');
      // this.noble.disconnect();
      this.sensorTagCtl.disconnect();

      process.exit();
    });
  }
}
