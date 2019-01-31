import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { configData } from '../app.config'
@Injectable()
export class AdminService {

  getPendingNotices(pageNo: number): Observable<any> {
    return this._http.get(`${configData.apiUrl}pending-notices/${pageNo}`, { withCredentials: true });
  }
  getArchivedNotices(pageNo: number): Observable<any> {
    return this._http.get(`${configData.apiUrl}archived-notices/${pageNo}`, { withCredentials: true });
  }
  addEvent(event): Observable<any> {
    return this._http.post(`${configData.apiUrl}add-event`, event, { withCredentials: true });
  }
  getUsers(): Observable<any> {
    return this._http.get(`${configData.apiUrl}users`, { withCredentials: true });
  }
  deleteNotice(noticeId): Observable<any> {
    return this._http.delete(`${configData.apiUrl}notice/` + noticeId, { withCredentials: true });
  }
  archiveNotice(noticeId: number): Observable<any> {
    return this._http.get(`${configData.apiUrl}archive-notice/${noticeId}`, { withCredentials: true });
  }
  deleteEvent(noticeId): Observable<any> {
    return this._http.delete(`${configData.apiUrl}notice/` + noticeId, { withCredentials: true });
  }
  approveNotice(body): Observable<any> {
    return this._http.put(`${configData.apiUrl}approve-notice`, body, { withCredentials: true });
  }
  isAdmin(): boolean {
    if (localStorage.getItem('role') === 'ROLE_SADMIN') {
      return true;
    } else {
      return false;
    }
  }
  makeAdmin(emailId): Observable<any> {
    return this._http.post(`${configData.apiUrl}make-admin`, { userid: emailId }, { withCredentials: true });
  }
  deleteUser(id): Observable<any> {
    return this._http.delete(`${configData.apiUrl}user/${id}`, { withCredentials: true });
  }
  updateNotice(id, data): Observable<any> {
    return this._http.put(`${configData.apiUrl}notice/${id}`, data, { withCredentials: true })
  }
  getSingleUser(id): Observable<any> {
    return this._http.get(`${configData.apiUrl}user/${id}`, { withCredentials: true });
  }
  updateUser(user): Observable<any> {
    return this._http.put(`${configData.apiUrl}update-user`, user, { withCredentials: true });
  }
  getUsernameWithEmailId(): Observable<any> {
    return this._http.get(`${configData.apiUrl}get-user-list`, { withCredentials: true });
  }
  getEvents(pageNo: number): Observable<any> {
    return this._http.get(`${configData.apiUrl}get-events/${pageNo}`, { withCredentials: true });

  }
  arrayRemove(arr, value) {
    return arr.filter(function (element) {
      return element.id != value;
    });

  }
  searchPendingNotice(str: string): Observable<any> {
    return this._http.get(`${configData.apiUrl}search-pending-notices/${str}`, { withCredentials: true });
  }
  searchArchivedNotice(str: string): Observable<any> {
    return this._http.get(`${configData.apiUrl}search-archived-notices/${str}`, { withCredentials: true });
  }
  searchApprovedNotice(str: string): Observable<any> {
    return this._http.get(`${configData.apiUrl}search-approved-notices/${str}`, { withCredentials: true });
  }
  searchEvent(str: string): Observable<any> {
    return this._http.get(`${configData.apiUrl}search-events/${str}`, { withCredentials: true });
  }


  constructor(private _http: HttpClient) { }

}
