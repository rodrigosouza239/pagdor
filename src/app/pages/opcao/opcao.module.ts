import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Alert1Component } from '../../alert1/alert1.component';
import { OpcaoPageRoutingModule } from './opcao-routing.module';

import { OpcaoPage } from './opcao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcaoPageRoutingModule
  ],
  declarations: [OpcaoPage,Alert1Component],
  entryComponents: [Alert1Component]
})
export class OpcaoPageModule {}
