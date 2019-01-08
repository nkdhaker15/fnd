import { Component, Renderer } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ViewController} from 'ionic-angular';


import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
/**
 * Generated class for the OrderdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderdetail',
  templateUrl: 'orderdetail.html',
})
export class OrderdetailPage {
 loading:any;
 userOrders: any = {};
 trans_id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
  this.loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
			       this.trans_id = this.navParams.get("storeid");
				   

  }
   ionViewWillEnter() {	
   this.loadOrdersDetails();
   }
  
   loadOrdersDetails() {
    
    let user_req = {
              trans_id: this.trans_id
          };
         
              this.loading.present();
         this.apiBackendService.getOrderDetails(user_req).then((result: any) => { 
             this.loading.dismiss();             
            this.userOrders = result.result;
            console.log("order detail",this.userOrders); 

            }, (err) => { 
            console.log(err); 
             this.loading.dismiss();
            });
}  

}
