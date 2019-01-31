import { Component, OnInit, TemplateRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServices } from '../../user-authentication/services/auth.service';
import { UserService } from '../../user-authentication/services/user.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {


  modalRef: BsModalRef;
  events = [];
  eventTobeDeleted;
  tData = false;
  NA = 'N/A'
  currentPage: number;
  pages: number;
  tempEvents = [];
  eventDescription: string;
  searchTextChanged = new Subject<any>();


  constructor(private _messageService: MessageService,
    private _modalService: BsModalService,
    private _adminService: AdminService,
    private _router: Router,
    private _auth: AuthServices,
    private _userService: UserService,
    private _spinner: NgxSpinnerService) {

  }

  ngOnInit() {
    this.initTable();
    this.initDebounce();
  }
  initDebounce() {
    this.searchTextChanged.pipe(
      debounceTime(3000)
    ).subscribe(search => {
      this._adminService.searchEvent(search).subscribe((data) => {
        this.events = data;
      })
    });
  }
  initTable() {
    this._spinner.show();
    this._adminService.getEvents(1).subscribe((response) => {
      this.currentPage = 1;
      let data: any[] = response;
      let index = data.length;
      let count = parseInt(data.pop()['count']);
      if (count % 15 != 0) {
        this.pages = Math.floor(count / 11) + 1;
      } else {
        this.pages = Math.floor(count / 11);
      }
      data.splice((index - 1), 1)
      this.events = data;
      this.tempEvents = this.events;



      this.tData = true;
      this._spinner.hide();
      this._userService.sendEvent(true);
    }, (err) => {
      this.tData = false;
      this._spinner.hide();
      if (err.status == 401) {
        this._router.navigate(['login']);
        this._auth.logout();
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please Login Again' });
      }
    })
  }
  openDescription(template: TemplateRef<any>, description: string) {
    this.eventDescription = description;
    this.modalRef = this._modalService.show(template);
  }

  loadPage(pageNo) {
    if (pageNo == 1 && this.currentPage == 1) {
    } else if (pageNo == 1) {
      this.initTable();
    } else {
      this._adminService.getEvents(pageNo).subscribe((response) => {
        this.currentPage = pageNo;
        this.events = response;
      }, (reason) => {
        if (reason.status == 401) {
          this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please Login Again' });
        } else {
          this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Page Loading Failed' });
        }
      })
    }

  }
  nextPage() {
    if (!((this.currentPage + 1) > this.pages)) {
      this.loadPage(this.currentPage + 1);
    }
  }
  previousPage() {
    if (!((this.currentPage - 1) <= 0)) {
      this.loadPage(this.currentPage - 1);
    }
  }

  deleteEvent() {
    this._spinner.show();
    this.modalRef.hide();
    this._adminService.deleteEvent(this.eventTobeDeleted).subscribe((data) => {

      this.events = this._adminService.arrayRemove(this.events, this.eventTobeDeleted)
      this._spinner.hide();
      this._messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Notice Deleted Successfully' });
    }, (reason) => {
      this._spinner.hide();
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Notice Deletion Failed' });
    })
  }
  decline() {
    this.modalRef.hide();
  }

  opneDeleteModal(eventId, template: TemplateRef<any>) {
    this.eventTobeDeleted = eventId;
    this.modalRef = this._modalService.show(template, { class: 'modal-sm' });
  }

  editNotice(eventId) {

    this._router.navigate(['admin/edit-notice/' + eventId]);
  }
  onKeyUp(event) {
    if (event.target.value) {
      this.searchTextChanged.next(event.target.value);
    } else {
      this.initTable();
    }
  }
}
