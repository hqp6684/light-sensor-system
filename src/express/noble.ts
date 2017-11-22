import { startScanning, on, stopScanning, Peripheral } from 'noble';
import { serveStatic } from 'serve-static';

import * as path from 'path';

export class Noble {
  constructor() {
    this._connect();
  }
  // TODO: Create a config file to store this instead of hard-coding value
  // private defaultSensorUUID = '24:71:89:E9:6F:86'.toLowerCase();
  private defaultSensorUUID = '247189E96F86'.toLowerCase();
  private sensors: Peripheral[] = [];
  private _sensorUUIDs = [this.defaultSensorUUID];

  private _connect() {
    on('stateChange', (state: string) => {
      console.log(state);

      if (state === 'poweredOn') {
        console.log('Scanning ');
        startScanning();
        // startScanning([this.defaultSensorUUID], true, e => {
        //   console.log('Error at scanning', e);
        // });
      } else {
        stopScanning();
      }
    });

    on('discover', peripheral => {
      // we found a peripheral, stop scanning
      console.log('Found the peripheral');

      console.log(peripheral.id);
      console.log(peripheral.address);
      console.log(peripheral.uuid);
      if (
        peripheral.id === this.defaultSensorUUID
        // peripheral.address === this.defaultSensorUUID
      ) {
        console.log(peripheral.id);
        stopScanning();
        peripheral.connect(error => {
          if (error) {
            console.log('Error connectiong to', peripheral.id, error);
          }

          //
          // Once the peripheral has been connected, then discover the
          // services and characteristics of interest.
          //
          peripheral.discoverAllServicesAndCharacteristics(
            (error, services, characteristics) => {
              if (error) {
                console.log(error);
              }
              services.forEach(s => {
                console.log('S: ', s.name);
                console.log('S', s.uuid);
              });

              characteristics.forEach(c => {
                console.log('C: ', c.name);
                console.log('C: ', c.uuid);
              });
            }
          );
        });
      }
    });
  }

  disconnect() {
    this.sensors.forEach(sensor => {
      console.log('Disconnecting ', sensor.address);
      sensor.disconnect(() => {
        console.log(sensor.address, ' disconnected');
      });
    });
  }
}
