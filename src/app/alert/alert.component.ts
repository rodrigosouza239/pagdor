import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {

  constructor( private router : Router, private modalController: ModalController) { }

ngOnInit() {}
confirm(){
  this.router.navigateByUrl("opcao")
  this.modalController.dismiss();
}

closeModal() {
    this.modalController.dismiss();
  }
}
