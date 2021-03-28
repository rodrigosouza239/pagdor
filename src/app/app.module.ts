import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { Screenshot } from '@ionic-native/screenshot/ngx';


export function playerFactory() {
  return player;
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    ChartsModule,
    LottieModule.forRoot({ player: playerFactory }),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__mydb',
driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Screenshot,
    OneSignal,
    LocalNotifications,
    MobileAccessibility,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
