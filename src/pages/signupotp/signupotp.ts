import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { SignupfinalPage } from '../signupfinal/signupfinal';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiBackendService } from '../../providers/apiBackendService';
declare var SMS:any;
/**
 * Generated class for the SignupotpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signupotp',
  templateUrl: 'signupotp.html',
})
export class SignupotpPage {
  registerForm: FormGroup;
  userData: any = {};    
  registerErrorMsg: any = '';    
  registerSuccessMsg: any = ''; 
  otpLength: boolean = false;    
  constructor(public navCtrl: NavController, public navParams: NavParams, public statusBar: StatusBar, private formBuilder: FormBuilder, public apiBackendService: ApiBackendService, public loadingCtrl: LoadingController, public androidPermissions: AndroidPermissions, public platform:Platform, private ngZone: NgZone) {
	  this.registerForm = this.formBuilder.group({
      user_otp: ['']
    });
      this.userData = this.navParams.get('user_data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupotpPage');
  }
  ionViewWillEnter()
 {
     
	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
	  success => console.log('Permission granted'),
	err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
	);

	this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
	this.readOtpSms();
 }
   _onKeyup(e) {
      
	const limit = 6;
	if (e.target.value.length > limit) {
	e.target.value = e.target.value.substring(0, 6);
	this.ngZone.run(()=>{
		this.otpLength = true;
	});
	}else if (e.target.value.length==6) {
		this.ngZone.run(()=>{
		this.otpLength = true;
	});
			console.log('ionViewDidLoad SignuponePage');

		
	}else {
		this.ngZone.run(()=>{
		this.otpLength = false;
	});
	}
};
  readOtpSms() {
	  this.platform.ready().then((readySource) => {

			if(SMS){ SMS.startWatch(()=>{
					   console.log('watching started');
					}, Error=>{
				   console.log('failed to start watching');
			   });

			  document.addEventListener('onSMSArrive', (e:any)=>{
				   var sms = e.data;
				    
				    let messageStr: string = sms.body;
					 if(messageStr.indexOf('Your one Time Password (OTP) for E-Comm') != -1) {
						this.ngZone.run(()=>{ this.otpLength = true;});
						let numbersOtp: any = messageStr.match(/\d+/g).map(Number);
						this.registerForm.patchValue({user_otp: numbersOtp});
					 }

				   });
			}
			});
  }  
  verifyOtp(){
      if(this.registerForm.value.user_otp == '') {
          this.registerErrorMsg = "Please enter otp.";
      }else if(this.registerForm.value.user_otp.length < 6 || this.registerForm.value.user_otp.length > 6 ) {
            this.registerErrorMsg = "Please enter valid otp.";
      }else {
          let credentials = {
              user_id: this.userData.user_id,
              user_otp: this.registerForm.value.user_otp
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.registerUserStep2(credentials).then((result: any) => { 
             loading.dismiss();
             this.registerErrorMsg = '';
             if(result.message == 'failed') {
                  this.registerErrorMsg = result.notification;
             }else
              if(result.message == 'ok') {
                  let user_data: any = {user_id: this.userData.user_id, phoneno: this.userData.phoneno };
                this.navCtrl.push(SignupfinalPage, {user_data: user_data});          
              }

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
      }
  }
    
    resendOtp(){
      let credentials = {
          user_id: this.userData.user_id,
          
      };
        
     let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loading.present();
     this.apiBackendService.resendUserOtp(credentials).then((result: any) => { 
         loading.dismiss();
         this.registerErrorMsg = '';
         this.registerSuccessMsg = '';
         if(result.message == 'failed') {
              this.registerErrorMsg = result.notification;
         }else
          if(result.message == 'ok') {
                    this.registerSuccessMsg = result.notification;
          }
          
        }, (err) => { 
        console.log(err); 
         loading.dismiss();
        });
	  
  }
  
   finalregister(){
	  this.navCtrl.push(SignupfinalPage);  
  }
    
   
}
