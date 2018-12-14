import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CartPage } from '../cart/cart';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tabBarElement: any;
    numbers = [0,1,2,3];

  constructor(public navCtrl: NavController) {

  }
ionViewWillEnter() {
		  	 	    //  this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

		      //this.tabBarElement.style.display = 'flex';
    console.log('ionViewDidLoad EditprofilePage');

  }
  
   mycartMethod()
  {
	  	   this.navCtrl.push(CartPage);    
	 // let nav = this.app.getRootNav(); 
	      //console.log('click OrdersPage');

  } 
}
