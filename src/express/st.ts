import { Observable } from 'rxjs';
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
  luxometer$: Observable<number>;
}

export class SensorTags {
  private _ids = ['id1'];
  private defaultSensorUUID = '247189E96F86'.toLowerCase();
  sensorTags: SensorTagI[] = [];
  constructor() {
    this.connectAndSetUp();
  }

  connectAndSetUp() {
    ST.discoverById(this.defaultSensorUUID, (sensorTag: SensorTagI) => {
      sensorTag.connectAndSetUp(error => {
        console.log('Connected to', this.defaultSensorUUID);
        if (error) {
          console.log(error);
        } else {
          sensorTag.enableLuxometer(err => {
            console.log('Enabled luxometer');
            if (err) {
              console.log(err);
            }
          });
          sensorTag.notifyLuxometer(err => {});
          sensorTag.on('luxometerChange', lux => {
            console.log(lux);
          });
          this.sensorTags.push(sensorTag);
        }
      });
    });
  }

  disconnect() {
    this.sensorTags.forEach(sensor => {
      sensor.disconnect(err => {
        console.log(err);
      });
    });
  }
}
