import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminService } from '../admin.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthServices } from '../../user-authentication/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../user-authentication/services/user.service';
import { FilterPipe } from '../filter.pipe';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'


@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})


export class NoticesComponent implements OnInit {

  modalRef: BsModalRef;
  notices = [];
  noticeToBeDeleted;
  tData = false;
  NA = 'N/A'
  noticeDescription: string;
  tempNotices = [];
  searchTextChanged = new Subject<any>();
  noticeType: FormControl;

  constructor(private _messageService: MessageService,
    private _modalService: BsModalService,
    private _dashboardService: DashboardService,
    private _adminService: AdminService,
    private _router: Router,
    private _auth: AuthServices,
    private _userService: UserService,
    private _searchFilterPipe: FilterPipe,
    private _spinner: NgxSpinnerService) {

  }
  currentPage: number;
  pages: number;

  prerequisites() {
    this.initForm();
    this.initDatatable();
    this.initDebounce();
  }
  ngOnInit() {
    this.prerequisites();
  }
  initDebounce() {
    this.searchTextChanged.pipe(
      debounceTime(3000)
    ).subscribe(search => {
      if (this.noticeType.value == 'Approved') {
        this._adminService.searchApprovedNotice(search).subscribe((data) => {
          this.notices = data;
        })
      } else if (this.noticeType.value == 'Archived') {
        this._adminService.searchArchivedNotice(search).subscribe((data) => {
          this.notices = data;
        })
      } else if (this.noticeType.value == 'Pending') {
        this._adminService.searchPendingNotice(search).subscribe((data) => {
          this.notices = data;
        })
      }
    });
  }
  initForm() {
    this.noticeType = new FormControl('Approved', Validators.required);
  }
  onChange() {
    this._spinner.show();
    this.initDatatable();
  }
  initDatatable(pageNo?: number) {
    this._userService.sendEvent(false);
    this._spinner.show();
    let noticePromise = new Promise((resolve, reject) => {
      if (this.noticeType.value == "Approved") {
        this._dashboardService.getNotices(pageNo ? pageNo : 1).subscribe((data) => {
          resolve(data);
        }, (reason) => {
          reject(reason);
        })
      } else if (this.noticeType.value == "Archived") {
        this._adminService.getArchivedNotices(pageNo ? pageNo : 1).subscribe((data) => {
          resolve(data);
        }, (reason) => {
          reject(reason);
        })
      } else if (this.noticeType.value == "Pending") {
        this._adminService.getPendingNotices(pageNo ? pageNo : 1).subscribe((data) => {
          resolve(data);
        }, (reason) => {
          reject(reason);
        })
      }
    })
    noticePromise.then((response: any[]) => {
      if (pageNo) {
        this.currentPage = pageNo;
        this.tempNotices = this.notices = response;
        this._spinner.hide();
      } else {
        this.currentPage = 1;
        let data: any[] = response;
        let index = data.length;
        let count = parseInt(data.pop()['count']);
        if (count % 11 != 0) {
          this.pages = Math.floor(count / 11) + 1;
        } else {
          this.pages = Math.floor(count / 11);
        }
        data.splice((index - 1), 1)
        this.tempNotices = this.notices = data;
        this.tData = true;
        this._spinner.hide();
      }
    }, (reason) => {
      this._spinner.hide();
      if (reason.status == 401) {
        this._router.navigate(['login']);
        this._auth.logout();
        this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please Login Again' });
      }
    })
  }
  openDescription(template: TemplateRef<any>, description: string) {
    this.noticeDescription = description;
    this.modalRef = this._modalService.show(template);
  }
  loadPage(pageNo) {
    if (pageNo == 1 && this.currentPage == 1) {
    } else if (pageNo == 1) {
      this.initDatatable();
    } else {
      this.initDatatable(pageNo);
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

  deleteNotice() {
    this._spinner.show();
    this.modalRef.hide();
    this._adminService.deleteNotice(this.noticeToBeDeleted).subscribe((data) => {

      this.notices = this._adminService.arrayRemove(this.notices, this.noticeToBeDeleted)
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

  opneDeleteModal(noticeId, template: TemplateRef<any>) {
    this.noticeToBeDeleted = noticeId;
    this.modalRef = this._modalService.show(template, { class: 'modal-sm' });
  }

  editNotice(noticeId) {

    this._router.navigate(['admin/edit-notice/' + noticeId]);
  }
  onSearchChange(searchValue: string) {
    this.notices = this._searchFilterPipe.transform(this.tempNotices, searchValue);
  }
  approveNotice(noticeId, user) {
    this._adminService.approveNotice({ id: noticeId, email: user, approvedDate: new Date() }).subscribe((data) => {
      this.notices = this._adminService.arrayRemove(this.notices, noticeId)
      this._messageService.add({ severity: 'success', summary: 'Approved', detail: 'Notice Approved Successfully' });
    }, (reason) => {
      this._messageService.add({ severity: 'error', summary: 'Failed', detail: 'Notice Approval Failed' });
    })
  }
  onKeyUp(event) {
    if (event.target.value) {
      this.searchTextChanged.next(event.target.value);
    } else {
      this.initDatatable();
    }
  }
}
