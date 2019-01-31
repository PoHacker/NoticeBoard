import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { configData } from '../../app.config';
import { UserService } from './user.service';

@Injectable()
export class AuthServices {


  constructor(private _http: HttpClient, private _userService: UserService) { }

  login(user): Observable<any> {
    // console.log(`${configData.apiUrl}`);
    return this._http.post(`${configData.apiUrl}login`, user, { withCredentials: true })
  }
  setToken(user) {
    console.log(user, user.profile_pic)
    localStorage.setItem('email', user.email_address);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('role', user.type);
    localStorage.setItem('userId', user.user_id);
    localStorage.setItem('profilePic', user.profile_pic);
  }
  googleLogin(user): Observable<any> {
    return this._http.post(`${configData.apiUrl}google-login`, user, { withCredentials: true })
  }
  logout() {
    console.log('logging out local')
    localStorage.removeItem("email");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem('userId');
    this._userService.sendLogout(false);
  }
  userExists() {
    if (localStorage.getItem('email')) {
      return true;
    } else {
      return false;
    }
  }

}
