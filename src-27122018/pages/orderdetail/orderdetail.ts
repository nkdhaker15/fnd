import { Component, Renderer } from '@angular/core';
import {   ViewController } from 'ionic-angular';
/**
 * Generated class for the OrderdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderdetail',
  templateUrl: 'orderdetail.html',
})
export class OrderdetailPage {
 
  constructor(public renderer: Renderer, public viewCtrl: ViewController) {

  }
  

}
