import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, AlertController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { NotificationsService } from './services/notifications.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  scheduled = [];
  public appPages = [
    {
      title: 'OPÇÃO',
      url: '/opcao',
      icon: 'alarm'
    },
    {
      title: 'SAIR',
      url: '/home',
      icon: 'enter'
    },
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalController: ModalController,
    private router: Router,
    private mobileAccessibility: MobileAccessibility,
    private oneSignal: OneSignal,
    private localNofications: LocalNotifications,
    private alertCtrl: AlertController,
    private storage: Storage,
    private navCtrl: NavController,
    private notificationsService: NotificationsService
  ) {
    platform
    .ready()
    .then(()=>{
        mobileAccessibility.usePreferredTextZoom(false);
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#2e1f62');
      this.splashScreen.hide();
      this.route();
      if (this.platform.is('cordova')) {
        this.setupPush();
        this.notifications();
      }
    });
  }

  async route() {
    const horaAcordar: string = await this.storage.get('notification_hora_acordar');
    const horaDormir: string = await this.storage.get('notification_hora_dormir');
    if (horaAcordar && horaDormir) {
      this.navCtrl.navigateRoot('icon');
    } else {
      this.navCtrl.navigateRoot('home');
    }
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('44288fb6-2b57-4306-ab35-187d25383f8d', 'ZDJmMDgxYjAtNGZiOC00YTg3LTljODAtZmU5ODQwNjYyYjM2');
 
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });
 
    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;
 
      this.showAlert('Agora nos mostre como você está se sentindo agoras', '!',  additionalData.task);
    });
 
    this.oneSignal.endInit();
  }
 
  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Vamos la ${task}`,
          handler: () => {
            this.router.navigateByUrl("/icon");
          }
        }
      ]
    })
    alert.present();
  }



  async presentModal() {
    const modal = await this.modalController.create({
      component: AlertComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }

  notifications() {
    (<any>window).skipLocalNotificationReady = true;
    
    /*this.localNofications.on('click').subscribe(data => {
      console.log(data);
      this.presentAlert('click', JSON.stringify(data));
    });
    this.localNofications.on('trigger').subscribe(data => {
      console.log(data);
      this.presentAlert('trigger', JSON.stringify(data));
    });
    this.localNofications.on('clear').subscribe(data => {
      console.log(data);
      this.presentAlert('clear', JSON.stringify(data));
    });
    this.localNofications.on('cancel').subscribe(data => {
      console.log(data);
      this.presentAlert('cancel', JSON.stringify(data));
    });
    this.localNofications.on('chart').subscribe(data => {
      console.log(data);
      this.presentAlert('chart', JSON.stringify(data));
    });*/

    this.localNofications.fireQueuedEvents();

    this.notificationsService.verify();
  }

  async presentAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });
  
    await alert.present();
  }





  getAll() {
    this.localNofications.getAll().then(res => {
      this.scheduled = res;
    });

  }





  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
