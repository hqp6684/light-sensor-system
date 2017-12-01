import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { StatusBarMock } from '@ionic-native-mocks/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashScreenMock } from '@ionic-native-mocks/splash-screen';
import { SensorTagProvider } from '../providers/sensor-tag/sensor-tag';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [MyApp, AboutPage, ContactPage, HomePage, TabsPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), PipesModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, AboutPage, ContactPage, HomePage, TabsPage],
  providers: [
    { provide: StatusBar, useClass: StatusBarMock },
    { provide: SplashScreen, useClass: SplashScreenMock },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SensorTagProvider
  ]
})
export class AppModule {}
