import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ThankyouPage } from '../thankyou/thankyou';

/**
 * Generated class for the PaymentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
})
export class PaymentsPage {
   orderInfo: any= {};
   selectedPaymentMethod: any = '';
   fromCheckout: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  if(this.navParams.get("orderInfo")!= undefined) {
		  this.fromCheckout = true;
		  this.orderInfo = this.navParams.get("orderInfo");
		  console.log("this.orderInfo:: ", this.orderInfo);
		  	  this.selectedPaymentMethod = 'cash';
	  }
  }
  selectPayMethod(pay_method) {
	  this.selectedPaymentMethod = pay_method;
  }
  proceedToPay() {
	  this.navCtrl.push(ThankyouPage, {orderInfo: this.orderInfo});  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentsPage');
  }

}
