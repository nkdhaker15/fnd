import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RmenuPage } from './rmenu';

@NgModule({
  declarations: [
    RmenuPage,
  ],
  imports: [
    IonicPageModule.forChild(RmenuPage),
  ],
})
export class RmenuPageModule {}
