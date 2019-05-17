import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SignuponePage } from '../signupone/signupone';
import { TabsPage } from '../tabs/tabs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { DetectlocationPage } from '../detectlocation/detectlocation';
import { SignupfinalPage } from '../signupfinal/signupfinal';
import { CartPage } from '../cart/cart';
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
   userLocationInfo: any = {};
  cartfrom:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams, public statusBar: StatusBar, public apiBackendService: ApiBackendService, private formBuilder: FormBuilder, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public fb: Facebook, private googlePlus: GooglePlus) {
    this.credentialsForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });	
	if(this.navParams.get("from"))
	{
	     this.cartfrom = this.navParams.get("from");
	}
	 this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.navCtrl.setRoot(TabsPage);
          }         
          
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage',this.cartfrom);
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
              this.loginErrorMsg = result.notification;
          }else if(result.message == 'ok') {
              this.authUserService.saveUser(result.results).then((status)=>{
				    if( this.cartfrom!='')
			  {
				  				   this.navCtrl.push(CartPage);	
			  }else{
				   this.navCtrl.setRoot(TabsPage);	
			  }
              });
          } 
        }, (err) => { 
        console.log(err); 
        });
  }
  
    loginUserUsingFacebook(facebook_id) {
      let credentials = {
          user_facebook_id: facebook_id
      };
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.apiBackendService.loginUserViaFacebook(credentials).then((result: any) => { 
        loading.dismiss();
          this.loginErrorMsg = '';
          if(result.message == 'failed') {
              let user_data: any = {user_id: result.result.user_id, phoneno: '', user_facebook_id: facebook_id};
                this.navCtrl.push(SignupfinalPage, {user_data: user_data}); 
          }else if(result.message == 'ok') {
              this.authUserService.saveUser(result.result).then((status)=>{
				    if( this.cartfrom!='')
			  {
				  				   this.navCtrl.push(CartPage);	
			  }else{
				   this.navCtrl.setRoot(TabsPage);	
			  }
              });
          } 
        }, (err) => { 
        console.log(err); 
        });
  }
    
  loginViaFacebook() {

      this.fb.login(['public_profile', 'email'])
		.then((res: FacebookLoginResponse) => {
			this.loginUserUsingFacebook(res.authResponse.userID);
		})
	  .catch(e => { 
			console.log('Error logging into Facebook', e); 
	  });
  } 
  loginViaGoogle() {
	  console.log('Error logging into Google');
	  this.googlePlus.login({})
  .then(res =>{
	  this.loginUserUsingGooglePlus(res.userId,res.email,res.givenName);
  })
  .catch(err =>{ console.error(err); });
  }
  
   loginUserUsingGooglePlus(facebook_id,email,first_name) {
      let credentials = {
          user_googleplus_id: facebook_id
      };
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.apiBackendService.loginUserViaGoogle(credentials).then((result: any) => { 
        loading.dismiss();
          this.loginErrorMsg = '';
          if(result.message == 'failed') {
              let user_data: any = {user_id: result.result.user_id, user_email:email ,user_first_name:first_name,phoneno: '', user_googleplus_id: facebook_id};
                this.navCtrl.push(SignupfinalPage, {user_data: user_data}); 
          }else if(result.message == 'ok') {
              this.authUserService.saveUser(result.result).then((status)=>{
				  this.authUserService.getUserLocation().then((userLocationInfo)=>{
          if(userLocationInfo != null && userLocationInfo != undefined) {
			  if( this.cartfrom!='')
			  {
				  				   this.navCtrl.push(CartPage);	
			  }else{
				   this.navCtrl.setRoot(TabsPage);	
			  }
             		  
          }else{
			  
			 this.navCtrl.push(DetectlocationPage);  
		  }     
      });    
                 // this.navCtrl.setRoot(TabsPage);
              });
          } 
        }, (err) => { 
        console.log(err); 
        });
  }
  
  forgotbutton() {
	  this.navCtrl.push(ForgotpasswordPage);  
  }
  openstepone() {
	  this.navCtrl.push(SignuponePage);  
  }
  logindata()
  {
	  this.authUserService.getUserLocation().then((userLocationInfo)=>{
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.navCtrl.setRoot(TabsPage);			  
          }else{
			  
			 this.navCtrl.push(DetectlocationPage);  
		  }     
      });    
	  
  }

}
