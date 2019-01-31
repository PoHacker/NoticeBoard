import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Router, NavigationEnd } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../user-authentication/services/user.service';
import { AdminService } from '../../admin/admin.service';
import { AuthServices } from '../../user-authentication/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  today = (new Date()).toDateString();
  notices = [];
  events = [];
  pages: number;
  navigationSubscription;
  type: string;
  isEvent: boolean = false;
  currentPage: number;
  cardHeaderClasses: string[];
  eventHeaderClasses: string[];

  constructor(private _userService: UserService,
    private _adminService: AdminService,
    private _messageService: MessageService,
    private _router: Router,
    private _auth: AuthServices,
    private _dashboardService: DashboardService,
    private _spinner: NgxSpinnerService) {
    this.navigationSubscription = this._router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.getInitialData();
      }
    })
  }
  getInitialData() {
    if (this._router.url == '/dashboard/notice' || this._router.url == '/dashboard/event') {
      this.prerequisite();
    }
  }
  ngOnInit() {
    this.prerequisite();
  }
  prerequisite() {
    this.initClassValues();
    this.getData();
    this._userService.sendAdmin(this._adminService.isAdmin());
  }
  initClassValues() {
    this.cardHeaderClasses = ['card-header', 'card-header header--blue', 'card-header header--darkblue', 'card-header header--orange', 'card-header header--red', 'card-header header--darkred'];
    this.eventHeaderClasses = ['pointer border-green', 'pointer border-blue', 'pointer border-darkblue', 'pointer border-orange', 'pointer border-red']
  }
  getData() {
    this._spinner.show();
    this._dashboardService.getDashboardEvents(1).subscribe((data) => {
      this.events = data;
      this._spinner.hide();
    }, (err) => {
      this._spinner.hide();
      this._router.navigate(['login']);
      this._auth.logout();
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please Login Again' });
    })
    this._dashboardService.getDashboardNotices(1).subscribe((response) => {
      this.currentPage = 1;
      let data: any[] = response;
      let index = data.length;
      let count = parseInt(data.pop()['count']);
      if (count % 6 != 0) {
        this.pages = Math.floor(count / 6) + 1;
      } else {
        this.pages = Math.floor(count / 6);
      }
      data.splice((index - 1), 1)
      this.notices = data;
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
  addNotice() {
    this._router.navigate(['add-notice']);
  }
  showDetailedNotice(id) {
    this._router.navigate(['noticeDetailed', id]);
  }
  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }
  loadPage(pageNo) {
    this._dashboardService.getDashboardNotices(pageNo).subscribe((response) => {
      this.currentPage = pageNo;
      for (let i = 0; i < response.length; i++) {
        this.notices.push(response[i]);
      }
    }, (reason) => {
      this._messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Loading Page Failed' });
    })
  }

  nextPage() {
    if (!((this.currentPage + 1) > this.pages)) {
      this.loadPage(this.currentPage + 1);
    }
  }
}
