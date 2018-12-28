import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductChildPage } from './product-child';

@NgModule({
  declarations: [
    ProductChildPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductChildPage),
  ],
})
export class ProductChildPageModule {}
