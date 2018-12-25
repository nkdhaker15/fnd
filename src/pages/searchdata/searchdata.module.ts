import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchdataPage } from './searchdata';

@NgModule({
  declarations: [
    SearchdataPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchdataPage),
  ],
})
export class SearchdataPageModule {}
