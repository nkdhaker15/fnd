import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthUserService } from '../../providers/authUserService';
import { ApiBackendService } from '../../providers/apiBackendService';

/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  editProfileForm: FormGroup;    
  tabBarElement: any;
  userInfo: any = {}; 
  editErrorMsg: any = '';       
  editSuccessMsg: any = '';       
  constructor(public navCtrl: NavController, public navParams: NavParams, private authUserService: AuthUserService, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, public apiBackendService: ApiBackendService) {
	   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      this.editProfileForm = this.formBuilder.group({
          user_first_name: [''],
          user_last_name: [''],
          user_email: [''],
          
    });
  }

  ionViewDidLoad() {
	      this.tabBarElement.style.display = 'none';
  }
 
   ionViewWillEnter() {
	  	 	      
    console.log('ionViewDidLoad EditprofilePage');
      this.authUserService.getUser().then((user)=>{
          this.userInfo = user;
          
      });
       

  }
    
  saveUserInfo() {
      
      let userReq = this.editProfileForm.value;
      userReq['user_id'] = this.userInfo.user_id;
      userReq['image_data'] = '';
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.apiBackendService.updateUser(userReq).then((result: any) => { 
        loading.dismiss();
          this.editErrorMsg = '';
          this.editSuccessMsg = '';
          if(result.message == 'failed') {
              this.editErrorMsg = result.notification;
          }else if(result.message == 'ok') {
              this.editSuccessMsg = result.notification;
              this.authUserService.saveUser(result.results).then((status)=>{
                  //this.navCtrl.setRoot(TabsPage);
              });
          } 
        }, (err) => { 
        console.log(err);
          loading.dismiss();
        });
      
  }    
}
