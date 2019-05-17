import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController} from 'ionic-angular';
import { EditprofilePage } from '../editprofile/editprofile';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { OffersPage } from '../offers/offers';
import { SharePage } from '../share/share';
import { FaqPage } from '../faq/faq';
import { OrdersPage } from '../orders/orders';
import { AddressbookPage } from '../addressbook/addressbook';
import { LoginPage } from '../login/login';
import { PaymentsPage } from '../payments/payments';
import { WallethistoryPage } from '../wallethistory/wallethistory';
import { Storage } from '@ionic/storage';

import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the MyaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {
  tabBarElement: any;
  userInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private authUserService: AuthUserService,public storage: Storage, private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {

  } 
  ionViewWillEnter() {
    console.log('ionViewDidLoad EditprofilePage');
      this.authUserService.getUser().then((user)=>{
          this.userInfo = user;
          
      });

  }
  loadprofileview()
  {
    this.navCtrl.push(EditprofilePage);  
  }
  loadchangeview()
  {
    this.navCtrl.push(ChangepasswordPage);  
  }
  loadofferview()
  {
    this.navCtrl.push(OffersPage);  
  }
    
  loadshareview()
  {
	    this.navCtrl.push(SharePage);    
  }
  loadfaqview()
  {
	    this.navCtrl.push(FaqPage);    
  }
  loadorderview()
  {
    this.navCtrl.push(OrdersPage);  
  }
   loadaddressbookview()
  {
    this.navCtrl.push(AddressbookPage);  
  }
  

  loadpayments()
  {
	  this.navCtrl.push(PaymentsPage);  
	  
  }
  loadwallethistory()
  {
		  this.navCtrl.push(WallethistoryPage);  
  
  }
  logoutUser(){
	
	 let alert = this.alertCtrl.create({
            title: 'Are you sure?',
            message: 'Do you want to logout?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  
                }
              },
              {
                text: 'Yes',
                handler: () => { 
				this.authUserService.logoutUser().then(()=>{
		 			this.storage.set("orderInProcessing", null);
          this.navCtrl.setRoot(LoginPage);  
      });
                }
              }
            ]
          });
          alert.present();
	
	
}

}
