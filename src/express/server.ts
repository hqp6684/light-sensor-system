import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { SensorTags } from './st';

import * as path from 'path';
import { Observable } from 'rxjs/Observable';

let st = require('sensortag');

export class Server {
  public app: express.Application;
  // public app : express.Application;
  private sensorTagCtl: SensorTags;
  private _server: http.Server;
  private port: string | number;
  private ioServer: SocketIO.Server;

  // Run configuration methods on the Express instance.
  constructor() {
    this.createApp();
    this.config();
    this.createServer();

    this.createSocketIoServer();

    // this.middleware();
    this.routes();

    // this.initSensorTags();

    this.setUpSocketEvents();
    this.listen();

    this.onExit();
  }

  private createApp() {
    this.app = express();
  }

  private config() {
    this.port = process.env.PORT || '8080';
  }

  private createServer() {
    this._server = new http.Server(this.app);
  }

  private createSocketIoServer() {
    this.ioServer = socketIO(this._server);
  }

  private listen() {
    this._server.listen(this.port, () => {
      console.log('Running server on port ', this.port);
    });
  }

  private setUpSocketEvents() {
    this.ioServer.on('connection', (socket: SocketIO.Socket) => {
      let request: express.Request = socket.request;
      console.log('A user connected with id ', socket.id);
      socket.on('disconnect', () => {
        console.log('User %s disconnected', socket.id);
      });
    });
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
        // res.sendFile('index.html', {
        //   root: path.resolve(__dirname, '../../lightClient/www')
        // });
        res.json({
          message: 'Hello World!'
        });
      }
    );
    this.app.use('/api', router);
    let staticRoot = path.resolve(__dirname, '../../lightClient/www');
    this.app.use('/', express.static(staticRoot));
  }

  // private initNoble() {
  //   this.noble = new Noble();
  // }

  private async initSensorTags() {
    console.log('Initializing SensorTags');
    this.sensorTagCtl = new SensorTags();
    await this.sensorTagCtl.connectAndSetUp();
    this.setupBroadCast();
  }

  private setupBroadCast() {
    let sensorTags = this.sensorTagCtl.sensorTags;
    let sources: Observable<any>[] = [];
    sensorTags.forEach(sensorTag => {
      let data: any = { id: sensorTag.id };
      let source = sensorTag.luxometer$.mergeMap(luxometer => {
        data.luxometer = luxometer;

        return sensorTag.temperature$.map(temperatures => {
          data.temperatures = temperatures;
          return data;
        });
      });
      sources.push(source);
    });

    sources.forEach(obs => {
      obs.subscribe(data => {
        this.ioServer.emit('sensorTag', data);
      });
    });
  }

  private onExit() {
    process.on('SIGINT', () => {
      console.log('Exiting');
      // this.noble.disconnect();
      this.sensorTagCtl.disconnect();

      process.exit();
    });
  }
}
