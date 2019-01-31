import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { configData } from '../../../../src/app/app.config';
import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../admin/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-notice-detailed',
  templateUrl: './notice-detailed.component.html',
  styleUrls: ['./notice-detailed.component.css']
})
export class NoticeDetailedComponent implements OnInit {

  noticeId;
  noticeDetails;
  eventDetails;
  isNotice: boolean;
  comments = [];
  commentData: FormGroup;
  editCommentData: FormGroup;
  commentError: boolean;
  userEmail: string;
  modalRef: BsModalRef;
  commentToBeDeleted: number;
  commentToBeModified: any;
  attendeesList = [];
  isLoggedIn: boolean;

  constructor(private _messageService: MessageService,
    private _activatedRoute: ActivatedRoute,
    private _adminService: AdminService,
    private _router: Router,
    private _http: HttpClient,
    private _modalService: BsModalService,
    private _dashboardService: DashboardService,
    private _socialAuthService: AuthService,
    private _spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.prerequisites();
  }

  prerequisites() {
    this.noticeId = this._activatedRoute.snapshot.params['id'];
    this.initForm();
    this.getComments();
    this.getDetails();
    this.initUser();
  }
  initUser() {
    this.userEmail = localStorage.getItem('email');
  }
  initForm() {
    this._spinner.show();
    this.commentError = false;
    this.commentData = new FormGroup({
      comment: new FormControl('', [Validators.required, this.noWhitespaceValidator])
    })
  }
  getComments() {
    this._dashboardService.getComments(this.noticeId).subscribe((data) => {
      this.comments = data;
    }, (reason) => {
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Comments Loading Failed' });
    })
  }
  getDetails() {
    this._dashboardService.getSingleDetails(this.noticeId).subscribe((data) => {
      if (data.type == 'event') {
        this.eventDetails = data;
        this.attendeesList = data.attendeesDetails;
      } else {
        this.noticeDetails = data;
      }
      this._spinner.hide();
    }, (err) => {
      if (err.status == 401) {
        this._spinner.hide();
        this._router.navigate(['dashboard']);
      }
    })
  }
  clearForm() {
    this.commentData.reset();
  }
  postComment() {
    if (!this.commentData.valid) {
      this.commentError = true;
    } else {
      this.commentError = false;
      this.commentData.value.noticeId = this.noticeId;
      this.commentData.value.creationDate = new Date();

      this._dashboardService.postComment(this.commentData.value).subscribe((data) => {
        this.getComments()
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Your Comment Successfully Added' });
        this.commentData.reset();
        this._spinner.hide();
      }, (reason) => {
        if (reason.status == 401 && localStorage.getItem('email')) {
          let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
          this._socialAuthService.signIn(socialPlatformProvider).then(
            (userData) => {
              this._spinner.show();
              this._http.post(`${configData.apiUrl}google-login`, { email: userData.email }, { withCredentials: true }).subscribe((user) => {
                this.postComment();
              }, (err) => {
                this._spinner.hide();
                this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Posting Comment Failed' });
              })
            }, (reason) => {
              this._spinner.hide();
              this._messageService.add({ severity: 'error', summary: 'Login Failure', detail: 'Failed To Login' });
            })
        } else if (reason.status == 401) {
          this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please login to post comment' });
        } else {
          this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Posting Comment failed' });
        }
      })
    }
  }
  get comment() { return this.commentData.get('comment') }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  deleteComment() {
    this._dashboardService.deleteComment(this.commentToBeDeleted).subscribe((data) => {
      this.comments = this._adminService.arrayRemove(this.comments, this.commentToBeDeleted);
      this._messageService.clear('deleteTemplate');
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Your comment deleted successfully' });
    }, (reason) => {
      this._messageService.clear('deleteTemplate');
      if (reason.status == 401) {
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please login again to delete comment' });
      } else {
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Deleting comment failed' });
      }
    })
  }
  onReject() {
    this._messageService.clear('deleteTemplate');
  }
  opneDeleteModal(commentId: number) {
    this.commentToBeDeleted = commentId;
    this._messageService.add({ key: 'deleteTemplate', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed' });
  }
  decline() {
    this.modalRef.hide();
  }
  openEditModal(comment: any, template: string) {
    this.commentToBeModified = comment;
    this.editCommentData = new FormGroup({
      comment: new FormControl(this.commentToBeModified.description, [Validators.required, this.noWhitespaceValidator])
    })
    this.modalRef = this._modalService.show(template);
  }
  editComment() {
    this._spinner.show();
    this._dashboardService.editComment(this.commentToBeModified.id, this.editCommentData.value).subscribe((data) => {
      this.getComments();
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Your comment modified successfully' });
      this.commentData.reset();
      this.modalRef.hide();
      this._spinner.hide();
    }, (reason) => {
      this._spinner.hide();
      this.modalRef.hide();
      if (reason.status == 401) {
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please login again to edit comment' });
      } else {
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Editing comment failed' });
      }
    })
  }
  showAttendees(templata: string) {
    this.modalRef = this._modalService.show(templata)
  }
}