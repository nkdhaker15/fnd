import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController ,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SignuponePage } from '../signupone/signupone';
import { TabsPage } from '../tabs/tabs';
import { FormBuilder, FormGroup } from '@angular/forms';
/*import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';*/

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentialsForm: FormGroup;
  loginErrorMsg: any = '';    
  constructor(public navCtrl: NavController, public navParams: NavParams, public statusBar: StatusBar, public apiBackendService: ApiBackendService, private formBuilder: FormBuilder, private authUserService: AuthUserService,  public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    this.credentialsForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
    
ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.navCtrl.setRoot(TabsPage);
          }         
          
      });

  }    
    
  loginUser() {
      let credentials = {
          username: this.credentialsForm.value.email,
          password: this.credentialsForm.value.password
      };
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.apiBackendService.loginUser(credentials).then((result: any) => { 
        loading.dismiss();
          this.loginErrorMsg = '';
          if(result.message == 'failed') {
              //this.loginErrorMsg = result.notification;
			  this.showAlert(result.notification);
          }else if(result.message == 'ok') {
              this.authUserService.saveUser(result.results).then((status)=>{
                  this.navCtrl.setRoot(TabsPage);
              });
          } 
        }, (err) => { 
        console.log(err); 
        });
  }
    
  loginViaFacebook() {
      /*this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
  .catch(e => console.log('Error logging into Facebook', e));*/
  } 
  forgotbutton() {
	  this.navCtrl.push(ForgotpasswordPage);  
  }
  openstepone() {
	  this.navCtrl.push(SignuponePage);  
  }
  logindata()
  {
	      this.navCtrl.setRoot(TabsPage);
	  
  }
  showAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  directhome()
  {
	 	      this.navCtrl.setRoot(TabsPage);
 
	  
  }
}
