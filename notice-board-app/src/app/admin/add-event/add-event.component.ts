import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../user-authentication/services/user.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  eventDetails: FormGroup;
  loading: boolean = false;
  now: Date = new Date();

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  emailsList = false;


  public editor;
  initform: boolean;
  toolbarOptions = [['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']];
  public editorContent = `<h3>I am Example 03</h3>`;
  input;
  public editorConfig = {
    placeholder: "Description of the event",
    modules: {
      toolbar: this.toolbarOptions
    },
    theme: 'snow'
  };
  onEditorBlured(quill) {
  }
  onEditorFocused(quill) {
  }
  onEditorCreated(quill) {
    this.editor = quill;
  }
  onContentChanged({ quill, html, text }) {
    this.input = html;
  }
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _adminService: AdminService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _spinner: NgxSpinnerService,
    private _location: Location
  ) { }
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this._userService.sendEvent(false);
    this._spinner.show();
    moment().format();
    this.eventDetails = this._fb.group({
      type: this._fb.control('event', Validators.required),
      title: this._fb.control('', [Validators.required, Validators.maxLength(60)]),
      description: this._fb.control('', [Validators.required, Validators.minLength(10)]),
      start: this._fb.control('', Validators.required),
      end: this._fb.control('', [Validators.required, this.startEndValidator]),
      attendees: this._fb.control('')
    }, { validator: this.startEndValidator });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'email',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    this.emailsList = false;
    this._adminService.getUsernameWithEmailId().subscribe((emails) => {
      if (emails) {
        this.emailsList = true;
        for (let i = 0; i < emails.length; i++) {
          this.dropdownList.push({ item_id: i + 1, email: emails[i].name + ' (' + emails[i].email_address + ')' });

        }
      }
    })
    this._spinner.hide();
    this.initform = true
  }
  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onSubmit() {
    if (this.eventDetails.get('attendees')) {
      let temp = this.attendees.value.map((o) => {
        return { item_id: o.item_id, email: o.email.substr(o.email.indexOf('(') + 1, o.email.indexOf(')')) }
      })
      this.attendees.setValue(temp);
    }
    this._spinner.show();
    this.eventDetails.value.createdAt = new Date();
    this._adminService.addEvent(this.eventDetails.value).subscribe((info) => {
      this._spinner.hide();
      this._router.navigate(['admin/events']);
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Event Successfully Added to Dashboard' });
    }, (reason) => {
      this._spinner.hide();
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Adding Notice Failed' });
    })
  }
  get description() {
    return this.eventDetails.get('description');
  }
  get title() {
    return this.eventDetails.get('title');
  }
  get start() {
    return this.eventDetails.get('start');
  }
  get end() {
    return this.eventDetails.get('end');
  }
  get attendees() {
    return this.eventDetails.get('attendees');
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  startEndValidator(fg: FormGroup) {

    if (fg.controls) {
      let start = fg.controls['start']
      let end = fg.controls['end'];
      if (start.value) {
        if (start.value > end.value) {
          return ({ 'validTime': true });
        } else {
          return null;
        }
      } else {
        return ({ 'invalidStart': true })
      }
    }
  }
  cancel() {
    this._location.back();
  }
}
