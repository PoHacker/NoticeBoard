import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { configData } from './app.config';


@Injectable()
export class AppService {

  private LoginSubject = new Subject<any>();


  constructor(private _http: HttpClient) { }
  logout(): Observable<any> {
    return this._http.get(`${configData.apiUrl}logout`, { withCredentials: true });
  }
  isLoggedIn(): boolean {
    if (localStorage.getItem('email')) {
      return true;
    } else {
      return false;
    }
  }
  sendIsLoggedin(isLoggedin: boolean) {
    this.LoginSubject.next({ isLoggedIn: isLoggedin });
  }
  getIsLoggedin(): Observable<any> {
    return this.LoginSubject.asObservable();
  }
}
