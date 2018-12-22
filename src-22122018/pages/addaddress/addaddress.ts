import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';


/**
 * Generated class for the AddaddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addaddress',
  templateUrl: 'addaddress.html',
})
export class AddaddressPage {
  addAddressForm: FormGroup;
   userInfo: any = {};
   userAddresses: any = [];
   registerErrorMsg: string = ''; 
   addressInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    this.addAddressForm = this.formBuilder.group({
      ab_name: [''],
      ab_mobile_number: [''],
      ab_pincode: [''],
      ab_state: [''],
      ab_address: [''],
      ab_city: [''],
      ab_locality: [''],
      ab_type: [''],
      ab_default: [''],
        
    });
      
      if(this.navParams.get('addressInfo') != undefined) {
          this.addressInfo = this.navParams.get('addressInfo');
          
           this.addAddressForm.setValue({
                    ab_name: this.addressInfo.ab_name,
                  ab_mobile_number: this.addressInfo.ab_mobile_number,
                  ab_pincode: this.addressInfo.ab_pincode,
                  ab_state: this.addressInfo.ab_state,
                  ab_address: this.addressInfo.ab_address,
                  ab_city: this.addressInfo.ab_city,
                  ab_locality: this.addressInfo.ab_locality,
                   ab_type: this.addressInfo.ab_type,
                ab_default: this.addressInfo.ab_default==true?1:0,
           });
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddaddressPage');
  }
    
  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          
      });
      
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
            this.userAddresses = result;

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });

  } 
  
  addUserAddress() {
      this.registerErrorMsg = '';
      let credentials = this.addAddressForm.value;
     credentials['ab_user_id'] = this.userInfo.user_id;
      if(this.addressInfo['ab_id'] != undefined) {
          credentials['ab_id'] = this.addressInfo['ab_id'];
      }
     this.apiBackendService.addUserAddresses(credentials).then((result: any) => {         
         
         if(result.message == 'failed') {
              this.registerErrorMsg = result.notification;
         }else
          if(result.message == 'ok') {             
                 
          }
          
        }, (err) => { 
        console.log(err); 
        });
	  
  }
}
