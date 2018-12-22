import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {
	  tabBarElement: any;
   userInfo: any = {};
   userShareInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, private socialSharing: SocialSharing) {
	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }
  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
              this.loadShare();
          }         
          
      });
      
      

  }
loadShare() {
    
    let user_req = {
              user_id: this.userInfo.user_id
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getUserShare(user_req).then((result: any) => { 
             loading.dismiss();
             
            this.userShareInfo = result;

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
}
    
  shareApp() {
      let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
      this.socialSharing.share(this.userShareInfo.text_share_message, 'Food and drink').then(() => {
          // Sharing via email is possible
           loading.dismiss();
        }).catch(() => {
          // Sharing via email is not possible
           loading.dismiss();
        });
  }
    
  ionViewDidLoad() {
	  	  	      this.tabBarElement.style.display = 'none';

    console.log('ionViewDidLoad SharePage');
  }

}
