import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface SensorTagI {
  id: string;
  luxometer: number;
  temperatures: { objectTemperatre: any; ambientTemperature: any };
  batteryLevel: number;
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

  sensorTags$ = new BehaviorSubject<Map<string, SensorTagI>>(new Map());

  defaultPullingPeriod$ = new BehaviorSubject<number>(1);

  defaultTempUnit$ = new BehaviorSubject<string>('f');

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
      currentValues.set(sensorTag.id, sensorTag);
      this.sensorTags$.next(currentValues);
    });

    this.socket.on('pullingPeriod', (period: number) => {
      this.defaultPullingPeriod$.next(period);
    });
  }

  setNewPullingPeriod(period: number) {
    if (period <= 0) {
      return;
    }
    this.socket.emit('pullingPeriod', period);
    this.defaultPullingPeriod$.next(period);
  }
}
