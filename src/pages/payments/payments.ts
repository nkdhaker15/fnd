import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ThankyouPage } from '../thankyou/thankyou';
import { OrderprocessingPage } from '../orderprocessing/orderprocessing';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

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
   cartInfo: any= {};
   selectedPaymentMethod: any = '';
   fromCheckout: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private apiBackendService: ApiBackendService,  public loadingCtrl: LoadingController, public storage: Storage, public modalCtrl: ModalController) {
	  if(this.navParams.get("orderInfo")!= undefined) {
		  this.fromCheckout = true;
		  this.orderInfo = this.navParams.get("orderInfo");
		  this.cartInfo = this.navParams.get("cartInfo");
		  console.log("this.orderInfo:: ", this.orderInfo);
		  	  this.selectedPaymentMethod = 'cash';
	  }
  }
  selectPayMethod(pay_method) {
	  /*this.selectedPaymentMethod = pay_method;*/
	  this.selectedPaymentMethod = 'cash';
  }
  proceedToPay() {
	  
	  let loading = this.loadingCtrl.create({
		content: 'Please wait...'
	  });
	  loading.present();
	 this.apiBackendService.processCartDetails(this.cartInfo).then((result: any) => {         
		loading.dismiss();
		if(result.message == 'ok') {
			this.storage.set("cart", null);
			this.storage.set("cartAddonItems", null);
			this.storage.set("orderInProcessing", result);
			let order_info: any = result;
			let childModal = this.modalCtrl.create(ThankyouPage, {orderInfo: order_info});
			   childModal.onDidDismiss(data => {				 
				   this.navCtrl.push(OrderprocessingPage, {orderInfo: order_info}); 
			   });
			   childModal.present();
				 
		}
		  
		}, (err) => { 
		console.log(err); 
		});
	  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentsPage');
  }

}
