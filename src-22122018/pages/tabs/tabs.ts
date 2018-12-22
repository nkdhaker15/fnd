import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import { OrdersPage } from '../orders/orders';
import { MyaccountPage } from '../myaccount/myaccount';
import { HomePage } from '../home/home';
import { ExplorePage } from '../explore/explore';

import { StatusBar } from '@ionic-native/status-bar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab3Root = ExplorePage;
  tab4Root = MyaccountPage;
  tabBarElement: any;

  constructor(public statusBar: StatusBar,public navCtrl: NavController) {
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
  }
  myMethod()
  {
	  	   this.navCtrl.push(OrdersPage);    
  }
   myaccountMethod()
  {
	  	   this.navCtrl.push(MyaccountPage);    
  }
  
}
