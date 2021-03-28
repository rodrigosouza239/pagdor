import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  INTERVALO = 3; // De 3 em 3 horas
  // INTERVALO = 1; // De 1 em 1 horas
  NOTIFICATION_MIN = 30; // Limite Mínimo de notificações
  messages = [
    'Evite apertar, esfregar ou manter os dentes encostados',
    'Evite morder seus lábios, língua ou bochechas',
    'Evite roer unhas ou cantos dos dedos',
    'Não pressione a língua com força contra os dentes',
    'Evite abrir coisas com os dentes',
    'Evite mascar chiclete',
    'Evite apoiar a mão no queixo',
    'Evite segurar o telefone com a cabeça e o ombro',
    'Evite morder objetos',
    'Não durma apoiando a cabeça com as mãos',
    'Não coloque língua entre os dentes'
  ];

  constructor(private storage: Storage, private localNofications: LocalNotifications, private platform: Platform) {  }

  async verify(oldHoraAcordar?, oldHoraDormir?) {
    const horaAcordar: string = await this.storage.get('notification_hora_acordar');
    const horaDormir: string = await this.storage.get('notification_hora_dormir');

    if (horaAcordar && horaDormir) {
      if (oldHoraAcordar && oldHoraDormir) {
        if (String(horaAcordar) !== String(oldHoraAcordar) || String(horaDormir) !== String(oldHoraDormir)) {
          await this.storage.remove('notifications');
          await this.localNofications.cancelAll();
        }
      }
    } else {
      console.log('Horário não inserido!');
      return;
    }

    const notifications: ILocalNotification[] = await this.storage.get('notifications');

    if (!notifications) { // Gerar notificações
      console.log('Gerar');
      this.generateNotifications();
    } else {
      console.log('Não gerar');
    }
  }

  async generateNotifications() {
    const horaAcordar: string = await this.storage.get('notification_hora_acordar');
    const diffMin: number = Number(await this.storage.get('notification_diff_min'));
    let lastId = 0;
    const startDate = moment(); // Data atual
    const intervalLength: number = Number( Math.trunc(((diffMin / 60) / this.INTERVALO)) );
    let dateTime, localNotification: ILocalNotification, notificationsList: ILocalNotification[] = [];
    let indexMsg = 0;

    console.log('intervalLength', intervalLength);

    // Gerar as notificações
    for (let i = 0; i <= intervalLength; i++) {
      dateTime = moment(`${moment(startDate).format('YYYY-MM-DD')} ${horaAcordar}`).add(this.INTERVALO * i, 'hours');
      console.log(dateTime.format('YYYY-MM-DD HH:mm'));

      lastId++;

      localNotification = {
        id: lastId,
        title: 'ORI',
        text: this.messages[indexMsg],
        foreground: true,
        vibrate: true,
        smallIcon: 'res://drawable-hdpi/ic_stat_access_alarm.png',
        launch: true,
        trigger: {
          every: {
            hour: Number(dateTime.format('HH')),
            minute: Number(dateTime.format('mm'))
          },
          count: 1,
        }
      };

      indexMsg = (indexMsg === 10 ? 0 : indexMsg + 1);

      // Adicionar a lista que será salva no storage
      notificationsList.push(localNotification);

      if (this.platform.is('cordova')) {
        // Gerar notificação
        this.localNofications.schedule(localNotification);
      }
    }

    // Salvar no storage as notificações geradas
    let notifications: ILocalNotification[] = await this.storage.get('notifications');
    if (notifications !== null) {
      notifications = notifications.concat(notificationsList);
      await this.storage.set('notifications', notifications);
    } else {
      await this.storage.set('notifications', notificationsList);
    }
  }
}
