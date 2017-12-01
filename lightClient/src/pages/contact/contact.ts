import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { SensorTagProvider } from '../../providers/sensor-tag/sensor-tag';
import { OnInit } from '@angular/core';
import { NgPlural } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {
  defaultPullingPeriod: number = 1;
  pullingPeriods = [1, 5, 30, 60];
  constructor(
    public navCtrl: NavController,
    private sensorTagProvider: SensorTagProvider,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit(): void {
    this.sensorTagProvider.defaultPullingPeriod$.subscribe(period => {
      this.defaultPullingPeriod = period;
    });
  }

  presentPullingPeriodActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify pulling period',
      buttons: [
        // {
        //   text: 'Destructive',
        //   role: 'destructive',
        //   handler: () => {
        //     console.log('Destructive clicked');
        //   }
        // },
        {
          text: '1 Second',
          handler: () => {
            this.sensorTagProvider.defaultPullingPeriod$.next(1);
          }
        },
        {
          text: '5 Seconds',
          handler: () => {
            this.sensorTagProvider.defaultPullingPeriod$.next(5);
          }
        },
        {
          text: '30 Seconds',
          handler: () => {
            this.sensorTagProvider.defaultPullingPeriod$.next(30);
          }
        },
        {
          text: '1 Minute',
          handler: () => {
            this.sensorTagProvider.defaultPullingPeriod$.next(60);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
