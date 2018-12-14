import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {
	  tabBarElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }

  ionViewDidLoad() {
	  	  	      this.tabBarElement.style.display = 'none';

    console.log('ionViewDidLoad SharePage');
  }

}
