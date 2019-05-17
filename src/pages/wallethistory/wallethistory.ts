import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the WallethistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallethistory',
  templateUrl: 'wallethistory.html',
})
export class WallethistoryPage {
  wallethistory:any = [];
   userInfo: any = {};
user_balance:any=0;
  constructor(public navCtrl: NavController, public navParams: NavParams,public authUserService:AuthUserService,public apiBackendService:ApiBackendService, public loadingCtrl: LoadingController) {
	   this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
			  this.getwallethistory();
          }         
          
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WallethistoryPage');
  }
getwallethistory()
{
	 let user_req = {
              user_id: this.userInfo.user_id
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getwallethistor(user_req).then((result: any) => { 
             loading.dismiss();
             console.log("result::", result);
			 if(result.message=='ok')
			 {
            this.wallethistory = result.result;
			 }
			 this.user_balance = result.user_balance;
            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
	
}
}
