import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AddaddressPage } from '../addaddress/addaddress';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the AddressbookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addressbook',
  templateUrl: 'addressbook.html',
})
export class AddressbookPage {
      
	  tabBarElement: any;
      userInfo: any = {};
      userAddresses: any = [];
      registerErrorMsg = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
	  	  	  	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      
      
  }

  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad AddressbookPage');
  }
  
  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
              this.loadAddresses();
          }         
          
      });
      
      

  }
loadAddresses() {
    
    let user_req = {
              ab_user_id: this.userInfo.user_id
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getUserAddresses(user_req).then((result: any) => { 
             loading.dismiss();
             console.log("result::", result);
            this.userAddresses = result.result;

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
}
  editAddress(address) {
      this.navCtrl.push(AddaddressPage, {addressInfo: address});
  } 

  removeAddress(address_id) {
      let user_req = {
              ab_id: address_id
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.removeUserAddresses(user_req).then((result: any) => { 
             loading.dismiss();
             console.log("result::", result);
            //this.userAddresses = result.result;

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
  }

  clickaddadress()
  { 
	  this.navCtrl.push(AddaddressPage);
  }

  
}
