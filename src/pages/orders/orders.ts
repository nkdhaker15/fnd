import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  ,ModalController} from 'ionic-angular';
import { OrderdetailPage } from '../orderdetail/orderdetail';
import { RmenuPage } from '../rmenu/rmenu';

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
 order = [{ trans_id: "516745"},{ trans_id: "516735"},{ trans_id: "516735"},{ trans_id: "516765"},{ trans_id: "516747"}];

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
	  	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
	  	  	  	      this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad OrdersPage');
  }
  showorderdetail()
  {
	  
	  
	  // let contactModal = this.modalCtrl.create(OrderdetailPage);
  // contactModal.present();
   this.navCtrl.push(OrderdetailPage);  
   
  }
  openrestomenu()
  {
	     this.navCtrl.push(RmenuPage);  

	  
  }
}
