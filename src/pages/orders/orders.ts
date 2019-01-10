import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ViewController} from 'ionic-angular';
import { OrderdetailPage } from '../orderdetail/orderdetail';
import { RmenuPage } from '../rmenu/rmenu';
import { FaqPage } from '../faq/faq';
import { RatingreviewPage } from '../ratingreview/ratingreview';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';


/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
	  tabBarElement: any;
	      userInfo: any = {};
    userOrders: any = [];
loading:any;
 order = [{ trans_id: "516745"},{ trans_id: "516735"},{ trans_id: "516735"},{ trans_id: "516765"},{ trans_id: "516747"}];

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
	  	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
					  this.loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
  }

  ionViewDidLoad() {
	  	  	  	      this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad OrdersPage');
  }
    ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
              this.loadOrders();
          }         
          
      });
      
      

  }
  showorderdetail(storeid:any)
  {
	  
	  
	  // let contactModal = this.modalCtrl.create(OrderdetailPage);
  // contactModal.present();
   this.navCtrl.push(OrderdetailPage,{storeid:storeid});  
   
  }
  openrestomenu(storeid:any)
  {
	     this.navCtrl.push(RmenuPage,{sellerInfo: storeid});  

	  
  }
  loadOrders() {
    
    let user_req = {
              user_id: this.userInfo.user_id
          };
         
              this.loading.present();
         this.apiBackendService.getOrderInfo(user_req).then((result: any) => { 
             this.loading.dismiss();             
            this.userOrders = result.result;
            console.log("order history",this.userOrders); 

            }, (err) => { 
            console.log(err); 
             this.loading.dismiss();
            });
}  

getHelp(orderid:any)
{
	
		     this.navCtrl.push(FaqPage,{orderid: orderid});  

}
showuserrate(orderinfo:any)
{
	
			     this.navCtrl.push(RatingreviewPage,{orderinfo: orderinfo});  

}
}
