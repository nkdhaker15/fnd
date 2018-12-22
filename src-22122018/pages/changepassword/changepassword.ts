import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthUserService } from '../../providers/authUserService';
import { ApiBackendService } from '../../providers/apiBackendService';
/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  tabBarElement: any;
  changePasswordForm: any;
  editErrorMsg = '';    
  editSuccessMsg = '';  
  userInfo: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authUserService: AuthUserService, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, public apiBackendService: ApiBackendService) {
	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      this.changePasswordForm = this.formBuilder.group({
          user_old_password: [''],
          user_new_password: [''],
          user_confirm_password: [''],
          
    });

  }

  ionViewDidLoad() {
	  this.tabBarElement.style.display = 'none';
      this.authUserService.getUser().then((user)=>{
          this.userInfo = user;
          
      });
    console.log('ionViewDidLoad ChangepasswordPage');
  }
    
  changePasswordInfo() {
      this.editErrorMsg = '';
              this.editSuccessMsg = '';
      let userReq = this.changePasswordForm.value;
      if(userReq.user_new_password != userReq.user_confirm_password) {
          this.editErrorMsg = "Password and confirm password doesn't match.";
      }else{
          userReq['user_id'] = this.userInfo.user_id;
          
          let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loading.present();
          this.apiBackendService.changePassword(userReq).then((result: any) => { 
            loading.dismiss();
              
              if(result.message == 'failed') {
                  this.editErrorMsg = result.notification;
              }else if(result.message == 'ok') {
                  this.editSuccessMsg = result.notification;
                  
              } 
            }, (err) => { 
            console.log(err);
              loading.dismiss();
            });
      }
      
  }        
   goBack() {
    this.navCtrl.pop();
  }

}
