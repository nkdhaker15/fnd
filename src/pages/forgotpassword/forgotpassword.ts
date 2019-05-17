import { Component ,ViewChild} from '@angular/core';
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
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  tabBarElement: any;
  forgotPasswordForm: any;
  editErrorMsg = '';    
  editSuccessMsg = '';  
  userInfo: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authUserService: AuthUserService, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, public apiBackendService: ApiBackendService) {
	  	    //  this.input.setFocus();
      this.forgotPasswordForm = this.formBuilder.group({
          username: ['']
          
          
    });

  }

  ionViewDidLoad() {
	  
      this.authUserService.getUser().then((user)=>{
          this.userInfo = user;
          
      });
    console.log('ionViewDidLoad ChangepasswordPage');
  }
    
  forgotPasswordInfo() {
      this.editErrorMsg = '';
      this.editSuccessMsg = '';
      let userReq = this.forgotPasswordForm.value;
      if(this.forgotPasswordForm.value.username == '') {
          this.editErrorMsg = 'Please enter Email / Phone.';
          
      }else {
          
          let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loading.present();
          this.apiBackendService.forgotPassword(userReq).then((result: any) => { 
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
