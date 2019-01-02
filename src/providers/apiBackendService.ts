import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiBackendService {
  apiUrl = 'http://shopkiee.com/project/fandd/webapi';
  constructor(public http: Http) {
    console.log('Hello RestProvider Provider');
  }
    
  getUsers() {
      return new Promise(resolve => {
        this.http.get(this.apiUrl+'/users.php').subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
      });
  } 
 getSliders() {
	return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/slider', {}, requestOptions)
          .subscribe(res => {
		    let resdata: any = res;
            resolve(JSON.parse(resdata._body));
          }, (err: any) => {
            resolve(this._handleError(err, true));
          });
      });
  } 

 loginUser(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/loginUser', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }
	
 loginUserViaFacebook(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/facebooklogincheck', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }
	
    loginUserViaGoogle(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/googlepluslogincheck', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }	
  updateUser(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/updateuserprofile', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
 }

  forgotPassword(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/forgotpassword', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
             resolve(this._handleError(err, false));
          });
      });
 }

changePassword(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/changepassword', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
             resolve(this._handleError(err, false));
          });
      });
 }

 registerUserStep1(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

    registerUserStep2(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/verifyotp', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    } 

  resendUserOtp(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/resendotp', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

  registerUserFinalStep(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/finalregis', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

  addUser(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register-user.php', data, requestOptions)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

  getUserAddresses(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/addressbook', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

  getFaq(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/faq', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

  getUserShare(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/register/sharetext', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

  getUserOffers(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/dashboard/offerce', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }

	getDashbboardInfo(data) {
		return new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json' );
			const requestOptions = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl+'/dashboard', data, requestOptions)
			  .subscribe(res => {
				resolve(this._extractData(res));
			  }, (err) => {
				resolve(this._handleError(err, false));
			  });
		  });
    }
	
   getProductListInfo(data) {
		  return new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json' );
			const requestOptions = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl+'/product/index/'+data.seller_id, data, requestOptions)
			  .subscribe(res => {
				resolve(this._extractData(res));
			  }, (err) => {
				resolve(this._handleError(err, false));
			  });
		  });
    }	
  addUserAddresses(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/addressbook/addaddress', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }
	getCartAddon(data) {
		  return new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json' );
			const requestOptions = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl+'/cart', data, requestOptions)
			  .subscribe(res => {
				resolve(this._extractData(res));
			  }, (err) => {
				resolve(this._handleError(err, false));
			  });
		  });
	}
		processCartDetails(data) {
		  return new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json' );
			const requestOptions = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl+'/orders/createTransactionOnCartId', data, requestOptions)
			  .subscribe(res => {
				resolve(this._extractData(res));
			  }, (err) => {
				resolve(this._handleError(err, false));
			  });
		  });
	}
 removeUserAddresses(data) {
      return new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl+'/addressbook/removeaddress', data, requestOptions)
          .subscribe(res => {
            resolve(this._extractData(res));
          }, (err) => {
            resolve(this._handleError(err, false));
          });
      });
    }
   _extractData(response: any) {
       if(response.status == 200) {
           return JSON.parse(response._body);
       }
   }
   _handleError(error, multiple) {
       if(multiple) {
           return []; 
       }else {
            return {};        
       }
     
   }
}
