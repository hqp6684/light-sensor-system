import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface SensorTagI {
  id: string;
  luxometer$: BehaviorSubject<number>;
  temperature$: BehaviorSubject<any>;
}

/*
  Generated class for the SensorTagProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SensorTagProvider {
  constructor() {
    console.log('Hello SensorTagProvider Provider');

    this.createSocketClient();
    this.setUpIOEvents();
  }

  socket: SocketIOClient.Socket;
  socketConnected$ = new BehaviorSubject<boolean>(false);

  sensorTags$ = new BehaviorSubject<SensorTagI[]>([]);

  private createSocketClient() {
    this.socket = io('/', { port: '8080' });
  }
  private setUpIOEvents() {
    this.socket.on('connect', () => {
      this.socketConnected$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.socketConnected$.next(false);
    });

    this.socket.on('sensorTag', (sensorTag: SensorTagI) => {
      let currentValues = this.sensorTags$.value;
      if (!currentValues.indexOf(sensorTag)) {
        currentValues.push(sensorTag);
        this.sensorTags$.next(currentValues);
      }
    });
  }

  // listen(event: string) {
  //   switch (event) {
  //     case 'sensorTag':
  //       return this.sensorTagEvent();
  //   }
  // }

  // private sensorTagEvent() {
  //   this.socket.on('sensorTag', (sensorTag: SensorTagI) => {
  //     let currentValues = this.sensorTags$.value;
  //     if (!currentValues.indexOf(sensorTag)) {
  //       currentValues.push(sensorTag);
  //       this.sensorTags$.next(currentValues);
  //     }
  //   });
  // }
}
