import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
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
  selector: 'page-product-child',
  templateUrl: 'product-child.html',
})
export class ProductChildPage {
	productInfo: any = [];
    selectedChild: any = null;
    selectedChildId: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authUserService: AuthUserService, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, public apiBackendService: ApiBackendService, public viewCtrl: ViewController) {
	
      
  }

  
 
   ionViewWillEnter() {
	this.productInfo = this.navParams.get('productInfo');     	 	      
    
      /*this.authUserService.getUser().then((user)=>{
          this.userInfo = user;
          
      });*/
       

  }
  selectChildItem(child) {

	  this.selectedChild = child;
	  this.selectedChildId = child.pmp_id;
  }   
  selectThisItem() {
	  this.dismiss();
  }
  dismiss() {
   
   this.viewCtrl.dismiss(this.selectedChild);
  }
}
