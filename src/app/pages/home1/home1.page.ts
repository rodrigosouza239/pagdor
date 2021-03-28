import { Component, OnInit,OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController,Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-home1',
  templateUrl: './home1.page.html',
  styleUrls: ['./home1.page.scss'],
})
export class Home1Page implements OnInit {
  backButtonSubscription; 

  constructor(private router : Router,private storage: Storage,public navCtrl: NavController,private platform: Platform) { }

  ngOnInit() {
  }

  logout(){
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
}

}
