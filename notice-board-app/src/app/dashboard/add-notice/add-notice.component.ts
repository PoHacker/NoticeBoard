import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../admin/admin.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http'
import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { configData } from '../../../../src/app/app.config';
import { Location } from '@angular/common';



@Component({
  selector: 'app-add-notice',
  templateUrl: './add-notice.component.html',
  styleUrls: ['./add-notice.component.css']
})
export class AddNoticeComponent implements OnInit {

  noticeDetails: FormGroup;
  event: boolean = false;


  public editor;
  toolbarOptions = [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']];
  public editorContent = `<h3>I am Example 03</h3>`;
  input;
  public editorConfig = {
    placeholder: "Description of the Notice",
    modules: {
      toolbar: this.toolbarOptions
    },
    theme: 'snow'
  };



  constructor(private _adminService: AdminService,
    private _messageService: MessageService,
    private _dashBoardServices: DashboardService,
    private _fb: FormBuilder,
    private _router: Router,
    private _http: HttpClient,
    private _socialAuthService: AuthService,
    private _loaction: Location,
    private _spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.initForm();

  }

  initForm() {
    moment().format();

    this.noticeDetails = this._fb.group({
      type: new FormControl('notice', Validators.required),
      title: new FormControl('', [Validators.required, Validators.maxLength(60), this.noWhitespaceValidator]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), this.noWhitespaceValidator])


    })
  }
  onSubmit() {
    this._spinner.show();
    this.noticeDetails.value.createdAt = new Date();
    this._dashBoardServices.addNotice(this.noticeDetails.value).subscribe((data) => {
      this._spinner.hide();
      this._router.navigate(['dashboard']);
      if (this._adminService.isAdmin()) {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Notice Successfully Added to Dashboard' });
      } else {
        this._messageService.add({ life: 5000, severity: 'success', summary: 'Success', detail: 'Your notice is successfully sent to The admin after approval it is in on the Dashboard', });
      }

    }, (reason) => {
      if (reason.status == 401) {
        let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        this._socialAuthService.signIn(socialPlatformProvider).then(
          (userData) => {
            this._spinner.show();
            this._http.post(`${configData.apiUrl}google-login`, { email: userData.email }, { withCredentials: true }).subscribe((user) => {
              this.onSubmit();
            }, (err) => {
              this._spinner.hide();
              this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Adding Notice Failed' });
            })
          }, (reason) => {
            this._spinner.hide();
            this._messageService.add({ severity: 'error', summary: 'Login Failure', detail: 'Failed To Login' });
          })
      }
      else {
        this._spinner.hide();
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Adding Notice Failed' });
      }

    })
  }


  get title() {
    return this.noticeDetails.get('title');
  }
  get description() {
    return this.noticeDetails.get('description');
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  cancel() {
    this._loaction.back();
  }

}
