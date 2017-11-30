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

  enableTemperature(callback: (error: any) => void): void;

  disableTemperature(callback: (error: any) => void): void;

  // period 100 - 2550 ms, default period is 1000 ms
  setTemperaturePeriod(period: number, callback: (error: any) => void): void;

  notifyTemperature(callback: (error: any) => void): void;

  unnotifyTemperature(callback: (error: any) => void): void;
  readTemperature(callback: (error: any, lux: any) => void): void;

  on(event: SensorTagEvent, callback: (x: any, y?: any, z?: any) => void): void;

  luxometer$: Observable<number>;
  temperature$: Observable<number>;
}

export class SensorTags {
  private defaultSensorUUID = '247189E96F86'.toLowerCase();
  private secondarySensorUUID = '546C0E53064C'.toLowerCase();
  private _ids = [this.defaultSensorUUID, this.secondarySensorUUID];
  private _connectedDeviceCount = 0;
  sensorTags: SensorTagI[] = [];
  constructor() {
    this.connectAndSetUp();
  }

  private async discoverById(id: string) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      ST.discoverById(id, (sensorTag: SensorTagI) => {
        console.log('Discovered : ', id);
        // this.sensorTags.push(sensorTag);
        resolve(sensorTag);
      });
    });
  }

  private async _connectAndSetUp(sensorTag: SensorTagI) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      sensorTag.connectAndSetUp(error => {
        if (error) {
          console.log('Error at connect and set up : ', sensorTag.id);
          reject(error);
        }
        console.log(sensorTag.id, ' connected');
        resolve(sensorTag);
      });
    });
  }

  private async _connectAndSetUpAll() {
    await Promise.all(
      this._ids.map(async id => {
        let sensorTag = await this.discoverById(id);
        console.log('Pushing sensor');
        this.sensorTags.push(sensorTag);
      })
    );
    console.log('Setting up');
    await Promise.all(
      this.sensorTags.map(async sensorTag => {
        sensorTag = await this._connectAndSetUp(sensorTag);
        console.log('Setup is done');
        sensorTag.enableLuxometer(err => {
          console.log('Enabled luxometer');
          if (err) {
            console.log(err);
          }
        });
        sensorTag.notifyLuxometer(debugError);
        sensorTag.on('luxometerChange', lux => {
          console.log(sensorTag.id, lux);
        });
      })
    );
  }

  connectAndSetUp() {
    this._connectAndSetUpAll();
  }

  disconnect() {
    this.sensorTags.forEach(sensor => {
      sensor.disconnect(err => {
        console.log(err);
      });
    });
  }
}

function debugError(err: any) {
  console.log(err);
}
