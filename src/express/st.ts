import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
const ST = require('sensortag');
// import * as ST from '../../node_modules/sensortag';

import 'rxjs/add/operator/distinctUntilChanged';

export type SensorTagEvent = 'irTemperatureChange' | 'luxometerChange';

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

  enableIrTemperature(callback: (error: any) => void): void;

  disableIrTemperature(callback: (error: any) => void): void;

  // period 100 - 2550 ms, default period is 1000 ms
  setIrTemperaturePeriod(period: number, callback: (error: any) => void): void;

  notifyIrTemperature(callback: (error: any) => void): void;

  unnotifyIrTemperature(callback: (error: any) => void): void;
  readIrTemperature(callback: (error: any, lux: any) => void): void;

  on(event: SensorTagEvent, callback: (x: any, y?: any, z?: any) => void): void;

  luxometer$: BehaviorSubject<number>;
  temperature$: BehaviorSubject<any>;
}

export class SensorTags {
  private defaultSensorUUID = '247189E96F86'.toLowerCase();
  private secondarySensorUUID = '546C0E53064C'.toLowerCase();
  private _ids = [this.defaultSensorUUID, this.secondarySensorUUID];
  private _connectedDeviceCount = 0;
  sensorTags: SensorTagI[] = [];
  //
  defaultPullingPeriod$ = new BehaviorSubject<number>(1);
  constructor() {}

  /**
   *
   * @param id {string} sensor UUID
   */
  private async discoverById(id: string) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      ST.discoverById(id, (sensorTag: SensorTagI) => {
        console.log('Discovered : ', id);
        // this.sensorTags.push(sensorTag);
        resolve(sensorTag);
      });
    });
  }

  /**
   *
   * @param sensorTag {SensorTagI}
   * Connects to sensor
   */
  private async _connect(sensorTag: SensorTagI) {
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
  /**
   *
   * @param sensorTag {SensorTagI}
   * Enables meters and notifications
   */
  private async _setup(sensorTag: SensorTagI) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      // Create Observables
      sensorTag.luxometer$ = new BehaviorSubject(0);
      sensorTag.temperature$ = new BehaviorSubject(null);

      sensorTag.enableLuxometer(debugErrorFn);
      // Tell sensor tag to notify
      sensorTag.notifyLuxometer(debugErrorFn);
      sensorTag.on('luxometerChange', lux => {
        sensorTag.luxometer$.next(lux);
      });

      sensorTag.enableIrTemperature(debugErrorFn);
      sensorTag.notifyIrTemperature(debugErrorFn);
      sensorTag.on(
        'irTemperatureChange',
        (objectIrTemperature: any, ambientIrTemperature: any) => {
          sensorTag.temperature$.next({
            objectIrTemperature: objectIrTemperature,
            ambientIrTemperature: ambientIrTemperature
          });
        }
      );
      resolve(sensorTag);
    });
  }

  /**
   * Driver: connect and setup all sensor tags in order
   *
   */
  private async _connectSetUpAll() {
    await Promise.all(
      this._ids.map(async id => {
        let sensorTag = await this.discoverById(id);
        this.sensorTags.push(sensorTag);
      })
    );
    await Promise.all(
      this.sensorTags.map(async sensorTag => {
        sensorTag = await this._connect(sensorTag);
      })
    );

    await Promise.all(
      this.sensorTags.map(async sensorTag => {
        sensorTag = await this._setup(sensorTag);
      })
    );
  }

  /**
   * Call internal connect and setup
   */
  async connectAndSetUp() {
    await this._connectSetUpAll();
    this.watchForPeriodChange();
  }

  /**
   *
   * @param period {number}
   *
   */
  private setNewPullingPeriod(period: number) {
    this.sensorTags.forEach(sensorTag => {
      if (period >= 0) {
        return;
      }
      // convert to ms
      period = period * 1000;
      sensorTag.setIrTemperaturePeriod(period, error => {
        if (error) {
          debugErrorFn(error);
        } else {
          console.log('New period set for temp:', period, 'ms');
        }
      });
      sensorTag.setLuxometerPeriod(period, error => {
        if (error) {
          debugErrorFn(error);
        } else {
          console.log('New period set for lux:', period, 'ms');
        }
      });
    });
  }

  /**
   * Subcribes to default period for change to call {setNewPullingPeriod}
   */
  private watchForPeriodChange() {
    this.defaultPullingPeriod$.distinctUntilChanged().subscribe(period => {
      this.setNewPullingPeriod(period);
    });
  }

  /**
   * Disconnect all sensor tags
   */
  disconnect() {
    this.sensorTags.forEach(sensor => {
      sensor.disconnect(err => {
        console.log(err);
      });
    });
  }
}

function debugErrorFn(err: any) {
  if (err) {
    console.log(err);
  }
}
