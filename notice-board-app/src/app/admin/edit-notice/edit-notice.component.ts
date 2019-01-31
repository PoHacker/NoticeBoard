import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../dashboard/dashboard.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AdminService } from '../admin.service';
import { MessageService } from 'primeng/api';
import { AuthServices } from '../../user-authentication/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { UserService } from '../../user-authentication/services/user.service';
import * as _ from "lodash";
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-notice',
  templateUrl: './edit-notice.component.html',
  styleUrls: ['./edit-notice.component.css']
})
export class EditNoticeComponent implements OnInit {
  isEvent: boolean = false;

  noticeId;
  now = new Date();
  noticeDetails: FormGroup;
  updatedValue = {};
  out;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  emailsList = false;

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

    placeholder: "Description",
    modules: {
      toolbar: this.toolbarOptions
    },
    theme: 'snow'
  };

  constructor(private _messageService: MessageService,
    private _router: Router,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _dashboardService: DashboardService,
    private _spinner: NgxSpinnerService,
    private _auth: AuthServices,
    private _location: Location,
    private _userService: UserService,
    private _adminService: AdminService) { }

  ngOnInit() {
    this.initForm();

  }
  initForm() {
    this._userService.sendEvent(false);
    this._spinner.show();
    this.noticeDetails = this._fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(60), this.noWhitespaceValidator]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), this.noWhitespaceValidator])
    })
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'email',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };

    this.noticeId = this._activatedRoute.snapshot.params['id'];
    this._dashboardService.getSingleDetails(this.noticeId).subscribe((data) => {
      this.out = data.start;
      if (data.type === "event") {
        moment().format();
        // this.noticeDetails.addControl('start', new FormControl(new Date(data.start)));
        this.noticeDetails.addControl('start', new FormControl('', Validators.required));
        this.noticeDetails.addControl('end', new FormControl('', Validators.required));
        this.noticeDetails.addControl('eventid', new FormControl('', Validators.required));
        this.noticeDetails.addControl('type', new FormControl('', Validators.required));
        this.noticeDetails.setValue({ 'title': data.title, 'description': data.description, 'start': new Date(data.start), 'end': new Date(data.end), 'eventid': data.eventid, 'type': data.type });
        this.noticeDetails.addControl('attendees', new FormControl(''));

        this.emailsList = false;

        this._adminService.getUsernameWithEmailId().subscribe((emails) => {
          if (emails) {
            for (let i = 0; i < emails.length; i++) {
              this.dropdownList.push({ item_id: i + 1, email: emails[i].name + ' (' + emails[i].email_address + ')' });
              // this.dropdownList.push({ item_id: i + 1, email: emails[i].email_address })
            }

            if (data.attendees[0].length >= 1) {
              for (let i = 0; i < data.attendees[0].length; i++) {
                this.selectedItems.push({ item_id: (this.dropdownList.find(x => x.email.substring(x.email.indexOf('(') + 1, x.email.indexOf(')')) == data.attendees[0][i])).item_id, email: data.attendees[0][i] });
              }
            }
            this.attendees.setValue(this.selectedItems);
            this.emailsList = true;
          }
        }, (reason) => {
        })
        this.isEvent = true;
      } else {
        this.isEvent = false;
        this.noticeDetails.setValue({ 'title': data.title, 'description': data.description });
      }
      this._spinner.hide();
    }, (err) => {

      if (err.status == 401) {
        this._spinner.hide();
        this._router.navigate(['login']);
        this._auth.logout();
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please Login Again' });
      }
    })
  }
  onSubmit() {
    if (this.noticeDetails.get('attendees')) {
      let temp = this.attendees.value.map((o) => {
        return { item_id: o.item_id, email: o.email.substring(o.email.indexOf('(') + 1, o.email.indexOf(')')) }
      })
      this.attendees.setValue(temp);
    }
    this._spinner.show();
    this._adminService.updateNotice(this.noticeId, this.noticeDetails.value).subscribe((data) => {
      this._spinner.hide();
      if (this.isEvent) {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Event Edited Successfully' });
        this._router.navigate(['admin/events']);
      } else {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Notice Edited Successfully' });
        this._router.navigate(['admin/notices']);
      }
    }, (reason) => {
      this._spinner.hide();
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Editing Notice Failed' });
    })
  }
  get title() { return this.noticeDetails.get('title') }
  get description() { return this.noticeDetails.get('description') }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  get attendees() {
    return this.noticeDetails.get('attendees') as FormArray
  }
  get start() {
    return this.noticeDetails.get('start');
  }
  get end() {
    return this.noticeDetails.get('end');
  }
  cancel() {
    this._location.back();
  }
}
