import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import { OrdersPage } from '../orders/orders';
import { MyaccountPage } from '../myaccount/myaccount';
import { CartPage } from '../cart/cart';
import { HomePage } from '../home/home';
import { ExplorePage } from '../explore/explore';

import { StatusBar } from '@ionic-native/status-bar';

import { AuthUserService } from '../../providers/authUserService';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab3Root = ExplorePage;
  tab4Root = MyaccountPage;
  tabBarElement: any;

  constructor(public statusBar: StatusBar,public navCtrl: NavController, private authUserService: AuthUserService) {
  statusBar.show();
	   statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#000000');

	  
  }
  ionViewDidLoad() {
		      //this.tabBarElement.style.display = 'visible';

  } 
  ionViewWillEnter() {
	  	 	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
				  if (this.tabBarElement) {
		      this.tabBarElement.style.display = 'flex';
				  }
    console.log('ionViewDidLoad EditprofilePage');
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          
      });

  }
  myMethod()
  {
	  	   this.navCtrl.push(OrdersPage);    
	 // let nav = this.app.getRootNav(); 
	      console.log('click OrdersPage');
}
  
  
   myaccountMethod()
  {
	  	   this.navCtrl.push(MyaccountPage);    
  }
  
}
