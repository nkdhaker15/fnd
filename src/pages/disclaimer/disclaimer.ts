import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the DisclaimerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html',
})
export class DisclaimerPage {
  tabBarElement: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
	    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }
  
  ionViewWillEnter() {	
  this.tabBarElement.style.display = 'none';
  		this.storage.get("allow_drink_status").then( (data)=>{
					  if(data != null) {
						this.navCtrl.setRoot(TabsPage);	  
						  
					  }
					  
			});
  
  }
  
  acceptDisclaimer() {
	  this.storage.set("allow_drink_status", 1).then( ()=>{				  
						this.navCtrl.setRoot(TabsPage);
	  });
  }
  

}
