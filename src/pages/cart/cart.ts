import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddaddressPage } from '../addaddress/addaddress';
import { OffersPage } from '../offers/offers';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
private currentNumber = 1;

 cartitem
 = [{ name: "Manish Garg"},{ name: "Ram Kumar"},{ name: "Rakesh"},{ name: "Mohan"},{ name: "Amit Sharma"}];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }
private increment () {
  this.currentNumber++;
}

private decrement () {
  this.currentNumber--;
}
clickaddadress()
{
	this.navCtrl.push(AddaddressPage);
	
}
clickpromocode()
{
	this.navCtrl.push(OffersPage);
	
}
}
