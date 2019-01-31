import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { configData } from '../../app.config';

@Injectable()
export class UserService {

  private subject = new Subject<any>();
  private adminSubject = new Subject<any>();
  private eventSubject = new Subject<any>();

  sendEvent(message: boolean) {
    this.eventSubject.next({ text: message });
  }
  getEvent(): Observable<any> {
    return this.eventSubject.asObservable();
  }

  sendLogout(message: boolean) {
    this.subject.next({ text: message });
  }
  sendAdmin(message: boolean) {
    console.log('adminis', message)
    this.adminSubject.next({ text: message });
  }

  getLogout(): Observable<any> {
    return this.subject.asObservable();
  }
  getAdmin(): Observable<any> {
    return this.adminSubject.asObservable();
  }


  constructor(private _http: HttpClient) { }
  registerUser(user): Observable<any> {
    return this._http.post(`${configData.apiUrl}create-user`, user);
  }
  generateOtp(email): Observable<any> {
    return this._http.post(`${configData.apiUrl}otp-generation`, { email: email });
  }
}









