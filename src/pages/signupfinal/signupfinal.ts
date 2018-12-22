import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the SignupfinalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signupfinal',
  templateUrl: 'signupfinal.html',
})
export class SignupfinalPage {
  registerForm: FormGroup;
  userData: any = {};    
  registerErrorMsg: any = '';    
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public apiBackendService: ApiBackendService, private authUserService: AuthUserService) {
      
      this.registerForm = this.formBuilder.group({
      user_first_name: [''],
      user_last_name: [''],
      user_email: [''],
      user_mobile_number: [''],
      user_password: [''],
      user_ref_id: ['']
    });
      this.userData = this.navParams.get('user_data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupfinalPage');
  }

  registerUser() {
  console.log("this.userData:: ", this.userData);
      let credentials = this.registerForm.value;
     credentials['user_id'] = this.userData.user_id;
	 if(this.userData['user_facebook_id'] != null && this.userData['user_facebook_id'] != undefined) {
		 credentials['user_facebook_id'] = this.userData['user_facebook_id'];
	 }
     this.apiBackendService.registerUserFinalStep(credentials).then((result: any) => {         
         this.registerErrorMsg = '';
         if(result.message == 'failed') {
              this.registerErrorMsg = result.notification;
         }else
          if(result.message == 'ok') {             
              this.authUserService.saveUser(result.results).then((status)=>{
                  this.navCtrl.setRoot(TabsPage);
              });     
          }
          
        }, (err) => { 
        console.log(err); 
        });
	  
  }  
  
  signup()
  {
     this.navCtrl.setRoot(TabsPage);

  }
}
