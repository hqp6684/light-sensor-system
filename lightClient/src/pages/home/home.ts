import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  SensorTagProvider,
  SensorTagI
} from '../../providers/sensor-tag/sensor-tag';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  constructor(
    public navCtrl: NavController,
    private sensorTagProvider: SensorTagProvider
  ) {}

  defaultTempUnit = 'f';
  sensorTags: SensorTagI[] = [];
  sensorTags$: Observable<SensorTagI[]>;

  ngOnInit() {
    this.sensorTagProvider.defaultTempUnit$.subscribe(unit => {
      this.defaultTempUnit = unit;
    });

    this.sensorTags$ = this.sensorTagProvider.sensorTags$
      .map(sensorTags => {
        let newSensors = [];
        sensorTags.forEach((v, k) => {
          newSensors.push(v);
        });
        return newSensors;
      })
      .filter(array => array.length > 0)
      .debounceTime(10);

    // this.sensorTags$.subscribe(test => {
    //   this.sensorTags = test;
    // });
  }

  trackBySensorId(index: number, item: SensorTagI) {
    return item.id;
  }
}
