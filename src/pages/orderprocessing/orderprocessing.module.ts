import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderprocessingPage } from './orderprocessing';

@NgModule({
  declarations: [
    OrderprocessingPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderprocessingPage),
  ],
})
export class OrderprocessingPageModule {}
