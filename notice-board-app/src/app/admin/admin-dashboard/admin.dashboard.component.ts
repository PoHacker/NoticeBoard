import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminService } from '../admin.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthServices } from '../../user-authentication/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../user-authentication/services/user.service';
import { debounceTime } from 'rxjs/operators'
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './admin.dashboard.component.html',
  styleUrls: ['./admin.dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  //Variable Declarations
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchTextChanged = new Subject<string>();

  pendingNotices = [];
  modalRef: BsModalRef;
  noticeIdToDeleted;
  currentPage: number;
  pages: number;
  tempPendingNotices = [];
  noticeDescription: string;
  searchValue: FormControl;

  constructor(private _messageService: MessageService,
    private _adminService: AdminService,
    private _modalService: BsModalService,
    private _auth: AuthServices,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _userService: UserService,
  ) {

  }

  //Prerequisites
  ngOnInit() {
    this.prerequisites();
  }
  prerequisites() {
    this.initForm();
    this.initDatatable();
    this.initDebounce();
  }
  initDebounce() {
    this.searchTextChanged.pipe(
      debounceTime(3000)
    ).subscribe(search => {
      this._adminService.searchPendingNotice(search).subscribe((data) => {
        this.pendingNotices = data;
      })
    });
  }
  onKeyUp(event) {
    if (event.target.value) {
      this.searchTextChanged.next(event.target.value);
    } else {
      this.initDatatable();
    }
  }
  initForm() {
    this.searchValue = new FormControl('');
  }


  initDatatable() {
    this._userService.sendEvent(false);
    this._spinner.show();
    this._adminService.getPendingNotices(1).subscribe((response) => {


      this.currentPage = 1;
      let data: any[] = response;
      let index = data.length;
      let count = parseInt(data.pop()['count']);
      if (count % 15 != 0) {
        this.pages = Math.floor(count / 15) + 1;
      } else {
        this.pages = Math.floor(count / 15);
      }
      data.splice((index - 1), 1)
      this.pendingNotices = data;
      this.tempPendingNotices = this.pendingNotices;


      this._spinner.hide();
    }, (err) => {
      this._spinner.hide();
      if (err.status == 401) {
        this._router.navigate(['login']);
        this._auth.logout();
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please Login Again' });
      }

    })
  }
  //Prerequisites End

  //Notice Delete Operation
  confirm() {
    this._spinner.show();
    this.modalRef.hide();
    this._adminService.deleteNotice(this.noticeIdToDeleted).subscribe((data) => {
      this._messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Pending notice got deleted' });
      // this.ngOnInit();
      this.pendingNotices = this._adminService.arrayRemove(this.pendingNotices, this.noticeIdToDeleted);
      this._spinner.hide();
    }, (reason) => {
      this._spinner.hide();
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Notice Deletion Failed' });
    })
  }
  decline() {
    this.modalRef.hide();
  }
  openModal(template: TemplateRef<any>, noticeId) {
    this.noticeIdToDeleted = noticeId;
    this.modalRef = this._modalService.show(template, { class: 'modal-sm' });
  }
  //Notice Delete Operation

  //Approve Notice
  approveNotice(noticeId, user) {
    this._adminService.approveNotice({ id: noticeId, email: user, approvedDate: new Date() }).subscribe((data) => {
      this.ngOnInit();
      this.dtTrigger.next();
      this._messageService.add({ severity: 'success', summary: 'Approved', detail: 'Notice Approved Successfully' });
    }, (reason) => {
      this._messageService.add({ severity: 'error', summary: 'Failed', detail: 'Notice Approval Failed' });
    })
  }
  //Approve Notice End  


  openDescription(template: TemplateRef<any>, description: string) {
    this.noticeDescription = description;
    this.modalRef = this._modalService.show(template);
  }
  loadPage(pageNo) {
    if (pageNo == 1 && this.currentPage == 1) {
    } else if (pageNo == 1) {
      this.initDatatable();
    } else {
      this._adminService.getPendingNotices(pageNo).subscribe((response) => {
        this.currentPage = pageNo;
        this.pendingNotices = response;
      }, (reason) => {
        if (reason.status == 401) {
          this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please Login Again' });
        } else {
          this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Loading Page Failed' });
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

  rejectNotice(noitceId: number) {
    this._adminService.archiveNotice(noitceId).subscribe((data) => {
      this.pendingNotices = this._adminService.arrayRemove(this.pendingNotices, noitceId);
      this._messageService.add({ severity: 'success', summary: 'Rejected', detail: 'The notice is rejected and moved to Archived.' });
    }, (err) => {
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Failed to Reject the notice' });
    })
  }

}
