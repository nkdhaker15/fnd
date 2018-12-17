import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
	  tabBarElement: any;
shownGroup = null;
 diseases = [];
  userInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController) {
	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }

  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
              this.loadFaq();
          }         
          
      });
      
      

  }
loadFaq() {
    
    let user_req = {
              user_id: this.userInfo.user_id
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getFaq(user_req).then((result: any) => { 
             loading.dismiss();
             
            this.diseases = result.result;

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
}

  ionViewDidLoad() {
	  	      this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad FaqPage');
  }
toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
};
isGroupShown(group) {
    return this.shownGroup === group;
};
}
