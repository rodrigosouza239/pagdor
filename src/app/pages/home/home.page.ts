import { Component, OnInit,ViewChild } from '@angular/core';
import { ModalController, Platform, AlertController,IonSlides } from '@ionic/angular';
import { AlertComponent } from '../../alert/alert.component';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('IonSlides',{static:true}) slides: IonSlides;
  slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { $, slides, rtlTranslate: rtl } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;
          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = -offset$$1;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }
  
           $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
  
           if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
          $slideEl
            .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, activeIndex, $wrapperEl } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          // eslint-disable-next-line
          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
  
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    }
    };
    scheduled = [];
  constructor(private router : Router, private oneSignal: OneSignal,
    private alertCtrl: AlertController,private modalController: ModalController,
    private plt:Platform, private localNofications: LocalNotifications,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    ) {
/*
    this.plt.ready().then(() => {
      this.localNofications.on('click').subscribe(res => {
        console.log('click: ', res);
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg)
      });

      this.localNofications.on('trigger').subscribe(res => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg)
      });

    });
*/
  }
  
  initializeApp() {
    this.plt.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.plt.is('cordova')) {
        this.setupPush();
      }
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AlertComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }

setupPush() {
  this.presentModal();
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

    this.showAlert('Agora nos mostre como você está se sentindo agoras', '!', additionalData.task);
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


  
  ngOnInit() {
  }

  next(slides) {
    console.log(slides)
    slides.slideNext();
  }

  


}
