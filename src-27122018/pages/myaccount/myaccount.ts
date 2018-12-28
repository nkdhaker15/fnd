import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { EditprofilePage } from '../editprofile/editprofile';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { OffersPage } from '../offers/offers';
import { SharePage } from '../share/share';
import { FaqPage } from '../faq/faq';
import { OrdersPage } from '../orders/orders';
import { AddressbookPage } from '../addressbook/addressbook';
import { LoginPage } from '../login/login';

import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the MyaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {
  tabBarElement: any;
  userInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private authUserService: AuthUserService) {
	 	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }

  ionViewDidLoad() {
		      this.tabBarElement.style.display = 'visible';

  } 
  ionViewWillEnter() {
	  	 	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
		      this.tabBarElement.style.display = 'flex';
    console.log('ionViewDidLoad EditprofilePage');
      this.authUserService.getUser().then((user)=>{
          this.userInfo = user;
          
      });

  }
  loadprofileview()
  {
    this.navCtrl.push(EditprofilePage);  
  }
  loadchangeview()
  {
    this.navCtrl.push(ChangepasswordPage);  
  }
  loadofferview()
  {
    this.navCtrl.push(OffersPage);  
  }
    
  loadshareview()
  {
	    this.navCtrl.push(SharePage);    
  }
  loadfaqview()
  {
	    this.navCtrl.push(FaqPage);    
  }
  loadorderview()
  {
    this.navCtrl.push(OrdersPage);  
  }
   loadaddressbookview()
  {
    this.navCtrl.push(AddressbookPage);  
  }
  
    logoutUser()
  {
      this.authUserService.logoutUser().then(()=>{
          this.navCtrl.setRoot(LoginPage);  
      });
  }
}
