const ST = require('sensortag');
// import * as ST from '../../node_modules/sensortag';

export type SensorTagEvent = 'gyroscopeChange' | 'luxometerChange';

export interface SensorTagI {
  id: string;
  type: 'cc2540' | 'cc2650';
  connectAndSetUp(callback: (error: any) => void): void;
  disconnect(callback: (error: any) => void): void;
  //   enableGyroscope(callback: (error: any) => void): void;

  //   disableGyroscope(callback: (error: any) => void): void;

  //   // period 100 - 2550 ms, default period is 1000 ms
  //   setGyroscopePeriod(period: number, callback: (error: any) => void): void;

  //   notifyGyroscope(callback: (error: any) => void): void;

  //   unnotifyGyroscope(callback: (error: any) => void): void;

  enableLuxometer(callback: (error: any) => void): void;

  disableLuxometer(callback: (error: any) => void): void;

  // period 100 - 2550 ms, default period is 1000 ms
  setLuxometerPeriod(period: number, callback: (error: any) => void): void;

  notifyLuxometer(callback: (error: any) => void): void;

  unnotifyLuxometer(callback: (error: any) => void): void;
  readLuxometer(callback: (error: any, lux: any) => void): void;

  on(event: SensorTagEvent, callback: (x: any, y?: any, z?: any) => void): void;
}

export class SensorTags {
  private _ids = ['id1'];
  sensorTags: SensorTagI[] = [];
  constructor() {}

  connectAndSetUp() {
    ST.discoverByid(this._ids[0], (sensorTag: SensorTagI) => {
      sensorTag.connectAndSetUp(error => {
        if (error) {
          console.log(error);
        } else {
          this.sensorTags.push(sensorTag);
        }
      });
    });
  }

  disconnect() {}
}
