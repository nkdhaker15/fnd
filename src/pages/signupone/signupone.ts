import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SignupotpPage } from '../signupotp/signupotp';

import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiBackendService } from '../../providers/apiBackendService';

/**
 * Generated class for the SignuponePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signupone',
  templateUrl: 'signupone.html',
})
export class SignuponePage {
  registerForm: FormGroup;
  registerErrorMsg = ''; 
  phoneLength: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public statusBar: StatusBar, private formBuilder: FormBuilder, public apiBackendService: ApiBackendService, public loadingCtrl: LoadingController) {
	  this.registerForm = this.formBuilder.group({
      phoneno: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignuponePage');
  }
 openotp(){
     if(this.registerForm.value.phoneno == '') {
         this.registerErrorMsg = "Please enter phone number";
     }else if(this.registerForm.value.phoneno.length < 10 || this.registerForm.value.phoneno.length > 10) {
         this.registerErrorMsg = "Please enter valid phone number";
     } else {
      let credentials = {
          user_phone: this.registerForm.value.phoneno
      };
      let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loading.present();
     this.apiBackendService.registerUserStep1(credentials).then((result: any) => { 
         this.registerErrorMsg = '';
         loading.dismiss();
         if(result.message == 'failed') {
              this.registerErrorMsg = result.notification;
         }else
          if(result.message == 'ok') {
              let user_data: any = {phoneno: this.registerForm.value.phoneno, user_id: result.user_id };
            this.navCtrl.push(SignupotpPage, {user_data: user_data});          
          }
          
        }, (err) => { 
        console.log(err); 
         loading.dismiss();
        });
     }
  }
  _onKeyup(e) {
      this.phoneLength = false;
const limit = 10;
if (e.target.value.length > limit) {
e.target.value = e.target.value.substring(0, 10);
    this.phoneLength = true;
}else if (e.target.value.length==10) {
    this.phoneLength = true;
	    console.log('ionViewDidLoad SignuponePage');

	
}
};
}
