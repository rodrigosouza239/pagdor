import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Alert1Component } from '../../alert1/alert1.component';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-opcao',
  templateUrl: './opcao.page.html',
  styleUrls: ['./opcao.page.scss'],
})
export class OpcaoPage implements OnInit {
  horaDormir: string;
  horaAcordar: string;

  constructor(private modalController: ModalController,
              private notificationService: NotificationsService,
              private storage: Storage,
              private toastController: ToastController) {

  }

  ngOnInit() {
  }

  async presentModal() {

    if (!this.horaAcordar || !this.horaDormir) {
      this.presentToast('Preencha todos os campos!');
      return;
    }

    const acordar = moment(this.horaAcordar).format('HH:mm');
    const dormir = moment(this.horaDormir).format('HH:mm');

    // Verificar diferença de horas
    let a = moment(`2020/01/01 ${acordar}`);
    let b = moment(`2020/01/01 ${dormir}`);
    let diffMin: number = b.diff(a, 'minutes');
    console.log('diffMin', diffMin);

    if (Number(diffMin) < 0) { // Indica que é do outro dia
      a = moment(`2020/01/01 ${acordar}`);
      b = moment(`2020/01/02 ${dormir}`);
      diffMin = b.diff(a, 'minutes');
      console.log('diffMin', diffMin);
    }
    if (Number(diffMin) < 360) { // 6 horas
      this.presentToast('Diferença de horas não permitida!');
      return;
    }

    const oldHoraAcordar = await this.storage.get('notification_hora_acordar');
    const oldHoraDormir = await this.storage.get('notification_hora_dormir');
    await this.storage.set('notification_hora_acordar', acordar);
    await this.storage.set('notification_hora_dormir', dormir);
    await this.storage.set('notification_diff_min', diffMin);

    // console.log(acordar);
    // console.log(dormir);
    try {
      this.notificationService.verify(oldHoraAcordar, oldHoraDormir);
    } catch (e) {
    }

    const modal = await this.modalController.create({
      component: Alert1Component,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });
    await modal.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
