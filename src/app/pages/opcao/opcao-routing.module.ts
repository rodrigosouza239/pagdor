import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcaoPage } from './opcao.page';

const routes: Routes = [
  {
    path: '',
    component: OpcaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcaoPageRoutingModule {}
