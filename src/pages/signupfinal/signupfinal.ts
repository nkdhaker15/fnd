import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform,AlertController,Navbar } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { LoginPage } from '../login/login';

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
	  @ViewChild(Navbar) navBar: Navbar;
  registerForm: FormGroup;
  userData: any = {};    
  registerErrorMsg: any = '';    
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,public platform: Platform,public alertCtrl: AlertController) {
      
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
	   this.navBar.backButtonClick = (e:UIEvent)=>{
     // todo something
     this.navCtrl.push(LoginPage);
    }
    console.log('ionViewDidLoad SignupfinalPage');
  }

  registerUser() {
	        let credentials = this.registerForm.value;

	   if(credentials['user_first_name']=='')
	  {
		  
		  this.registerErrorMsg = 'Please Enter First Name';
		  return;
	  }	
  if(credentials['user_last_name']=='')
	  {
		  
		  this.registerErrorMsg = 'Please Enter Last Name';
		  return;
	  }	
if(credentials['user_email']=='')
	  {
		  
		  this.registerErrorMsg = 'Please Enter Email';
		  return;
	  }
if(credentials['user_password']=='')
	  {
		  
		  this.registerErrorMsg = 'Please Enter Password';
		  return;
	  }	  

	  
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
