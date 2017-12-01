import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SensorTagProvider } from '../../providers/sensor-tag/sensor-tag';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    private sensorTagProvider: SensorTagProvider
  ) {}
}
