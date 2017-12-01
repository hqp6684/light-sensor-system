import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
const ST = require('sensortag');
// import * as ST from '../../node_modules/sensortag';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';
import { setInterval } from 'timers';

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

  // battery

  readBatteryLevel(
    callback: (error: Error, batteryLevel: number) => void
  ): void;

  on(event: SensorTagEvent, callback: (x: any, y?: any, z?: any) => void): void;

  luxometer$: BehaviorSubject<number>;
  temperature$: BehaviorSubject<any>;
  batteryLevel$: BehaviorSubject<number>;
  notifications$: BehaviorSubject<boolean>;
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
    sensorTag = await new Promise<SensorTagI>((resolve, reject) => {
      // Create Observables
      sensorTag.luxometer$ = new BehaviorSubject(0);
      sensorTag.temperature$ = new BehaviorSubject(null);
      sensorTag.batteryLevel$ = new BehaviorSubject(92);
      sensorTag.notifications$ = new BehaviorSubject(true);

      // Enbles different sensors
      sensorTag.enableLuxometer(debugErrorFn);
      sensorTag.enableIrTemperature(debugErrorFn);

      resolve(sensorTag);
    });

    sensorTag = await this._enableNotifications(sensorTag);
    sensorTag = await this._readBatteryLevel(sensorTag);

    // Finally : Config what happen on new notificaton
    return await new Promise<SensorTagI>((resolve, reject) => {
      sensorTag.on('luxometerChange', lux => {
        sensorTag.luxometer$.next(lux);
      });
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

  private async _readBatteryLevel(sensorTag: SensorTagI) {
    return new Promise<SensorTagI>((resolve, reject) => {
      sensorTag.readBatteryLevel((error, batteryLevel) => {
        if (error) {
          debugErrorFn(error);
          reject(sensorTag);
        } else {
          sensorTag.batteryLevel$.next(batteryLevel);
          resolve(sensorTag);
        }
      });
    });
  }

  private async _disableNotifications(sensorTag: SensorTagI) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      sensorTag.unnotifyIrTemperature(error => {
        if (error) {
          debugErrorFn(error);
        }
        sensorTag.unnotifyLuxometer(error => {
          if (error) {
            debugErrorFn(error);
          }
          sensorTag.notifications$.next(false);
          resolve(sensorTag);
        });
      });
    });
  }

  public toggleNotifications(data: { id: string; status: boolean }) {
    data.status
      ? this.enableNotifications(data.id)
      : this.disableNotifications(data.id);
  }
  private disableNotifications(id: string) {
    this.sensorTags.forEach(async sensorTag => {
      if (sensorTag.id === id) {
        // update battery level
        sensorTag = await this._readBatteryLevel(sensorTag);
        sensorTag = await this._disableNotifications(sensorTag);
      }
    });
  }

  private async _enableNotifications(sensorTag: SensorTagI) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      sensorTag.notifyIrTemperature(error => {
        if (error) {
          debugErrorFn(error);
        }
        sensorTag.notifyLuxometer(error => {
          if (error) {
            debugErrorFn(error);
          }
          sensorTag.notifications$.next(true);
          resolve(sensorTag);
        });
      });
    });
  }
  private enableNotifications(id: string) {
    this.sensorTags.forEach(async sensorTag => {
      if (sensorTag.id === id) {
        // update battery level
        sensorTag = await this._readBatteryLevel(sensorTag);
        sensorTag = await this._enableNotifications(sensorTag);
      }
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
  private async setNewPullingPeriod(period: number) {
    // this.sensorTags.forEach(sensorTag => {
    if (period <= 0) {
      return;
    }
    period = period * 1000;

    await Promise.all(
      this.sensorTags.map(async sensorTag => {
        sensorTag = await this.setLuxPeriod(sensorTag, period);
        sensorTag = await this.setTempPeriod(sensorTag, period);
      })
    );
  }
  private async setTempPeriod(sensorTag: SensorTagI, period: number) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      sensorTag.setIrTemperaturePeriod(period, error => {
        if (error) {
          debugErrorFn(error);
          reject(sensorTag);
        } else {
          console.log('New period set for temp:', period, 'ms');
          resolve(sensorTag);
        }
      });
    });
  }

  private async setLuxPeriod(sensorTag: SensorTagI, period: number) {
    return await new Promise<SensorTagI>((resolve, reject) => {
      sensorTag.setLuxometerPeriod(period, error => {
        if (error) {
          debugErrorFn(error);
          reject(sensorTag);
        } else {
          console.log('New period set for lux:', period, 'ms');
          resolve(sensorTag);
        }
      });
    });
  }

  /**
   * Subcribes to default period for change to call {setNewPullingPeriod}
   */
  private watchForPeriodChange() {
    this.defaultPullingPeriod$.distinctUntilChanged().subscribe(period => {
      console.log('New pulling period received ', period);
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
