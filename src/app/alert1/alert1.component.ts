import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert1',
  templateUrl: './alert1.component.html',
  styleUrls: ['./alert1.component.scss'],
})
export class Alert1Component implements OnInit {

  constructor(private router : Router, private modalController: ModalController) { }

  ngOnInit() {}

  confirm(){
    this.router.navigateByUrl("/home1")
    this.modalController.dismiss();
  }
  
  closeModal() {
      this.modalController.dismiss();
    }

}
