import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { configData } from '../app.config'

@Injectable()
export class DashboardService {

  constructor(private _httpClient: HttpClient) { }


  getDashboardNotices(pageNo: number): Observable<any> {
    return this._httpClient.get(`${configData.apiUrl}get-dashboard-notices/${pageNo}`, { withCredentials: true });
  }
  getDashboardEvents(pageNo: number): Observable<any> {
    return this._httpClient.get(`${configData.apiUrl}get-dashboard-events/${pageNo}`, { withCredentials: true });
  }
  getNotices(pageNo: number): Observable<any> {
    return this._httpClient.get(`${configData.apiUrl}get-notices/${pageNo}`, { withCredentials: true });

  }
  addNotice(notice): Observable<any> {
    return this._httpClient.post(`${configData.apiUrl}add-notice`, notice, { withCredentials: true });
  }
  getSingleDetails(noticeId): Observable<any> {
    return this._httpClient.get(`${configData.apiUrl}single-notice/${noticeId}`, { withCredentials: true });
  }
  getComments(noticeId): Observable<any> {
    return this._httpClient.get(`${configData.apiUrl}get-comments/${noticeId}`, { withCredentials: true })
  }
  postComment(data): Observable<any> {
    return this._httpClient.post(`${configData.apiUrl}comment`, data, { withCredentials: true });
  }
  deleteComment(commentId: number): Observable<any> {
    return this._httpClient.delete(`${configData.apiUrl}comment/${commentId}`, { withCredentials: true });
  }
  editComment(commentId: number, comment: object): Observable<any> {
    return this._httpClient.put(`${configData.apiUrl}comment/${commentId}`, comment, { withCredentials: true });
  }
}
