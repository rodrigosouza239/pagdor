import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Response } from 'src/app/models/response';
1

@Component({
  selector: 'app-icon',
  templateUrl: './icon.page.html',
  styleUrls: ['./icon.page.scss'],
})
export class IconPage implements OnInit {

  constructor(private storage: Storage,public alertController: AlertController, private router : Router,) { }

  ngOnInit() {
  }


  async Semdor() {
    const alert = await this.alertController.create({
      header: 'Muito bom!',
      message: 'Vamos acompanha como está a evolução da sua dor',
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.addValue(0);
          }
      }
      ]
    });

    await alert.present();
  }


  async Incomodo() {
    const alert = await this.alertController.create({
      header: 'Muito bom!',
      message: 'Vamos acompanha como está a evolução da sua dor',
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.addValue(50);
          }
      }
      ]
    });

    await alert.present();
  }


  async Comdor() {
    const alert = await this.alertController.create({
      header: 'Muito bom!',
      message: 'Vamos acompanhar como está a evolução da sua dor',
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.addValue(100);
          }
      }
      ]
    });

    await alert.present();
  }

  async addValue(val: number) {
    let responses: Response[] = JSON.parse(await this.storage.get('responses'));

    if (responses === null) {
      const responses_ = [];
      responses_.push({
        value: val,
        date: Date.now() // Data atual em milesegundos
      });
      await this.storage.set('responses', JSON.stringify(responses_));
    } else {
      responses.push({
        value: val,
        date: Date.now() // Data atual em milesegundos
      });
      await this.storage.set('responses', JSON.stringify(responses));
    }

    this.router.navigateByUrl("/graficos");
  }


}
