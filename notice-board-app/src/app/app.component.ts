import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServices } from './user-authentication/services/auth.service';
import { AppService } from './app.service';
import { UserService } from './user-authentication/services/user.service';
import { Location } from '@angular/common'
import { AdminService } from './admin/admin.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { NoticeDetailedComponent } from './dashboard/notice-detailed/notice-detailed.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAdmin = false;
  showDropdown: boolean = false;
  isLoggedIn: boolean = false;
  adminName: string;
  profilePic: string;

  ngOnInit() {
    this._userService.sendAdmin(this._adminService.isAdmin());
    this.checkLogout();
    this.checkAdmin();
    this.InitJquery();
    this.assingAdmin();
  }
  assingAdmin() {
    this.adminName = localStorage.getItem('userName');
    this.profilePic = localStorage.getItem('profilePic')

  }
  InitJquery() {
    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("active");
      $("#maincontent").toggleClass("p-l0");
      $("#logo").toggleClass("m-l220");
    });
    $(document).ready(function () {
      $("#flip1").click(function () {
        $("#panel1").slideToggle("slow");
        $("#d-arrow1").toggleClass("rotate");
      });
      $("#flip2").click(function () {
        $("#panel2").slideToggle("slow");
        $("#d-arrow2").toggleClass("rotate");
      });
      $("#flip3").click(function () {
        $("#panel3").slideToggle("slow");
        $("#d-arrow3").toggleClass("rotate");
      });
    });
  }

  checkAdmin() {
    this._userService.getAdmin().subscribe((value) => {
      this.isAdmin = value['text'];
    })
    if (localStorage.getItem('role') == 'ROLE_SADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

  }
  changeOfRoutes() {
    if (this._router.url == '/' || this._router.url == '/dashboard/event' || this._router.url == '/dashboard/notice') {
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
    }
  }
  checkLogout() {
    if (localStorage.getItem('userId')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    this._userService.getLogout().subscribe((value) => {
      if (value['text'] == true) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }, (err) => {
    })
  }
  constructor(private _messageService: MessageService,
    private _adminService: AdminService,
    private _location: Location,
    private _userService: UserService,
    private _appService: AppService,
    private _router: Router,
    private _auth: AuthServices,
    private _socialAuthService: AuthService,
    private _detailedNoticeService: NoticeDetailedComponent,
    private _spinner: NgxSpinnerService) { }
  logout() {
    this._spinner.show();
    this.isAdmin = false;
    this._appService.logout().subscribe(() => {
      this._auth.logout();
      this._spinner.hide();
      this._router.navigate(['dashboard']);
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged Out Successfully' })
    }, (reason) => {
      this._auth.logout();
      this._spinner.hide();
      this._router.navigate(['dashboard']);
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged Out Successfully' })
    })
    $("#wrapper").addClass("active");
    $("#maincontent").addClass("p-l0");
    $("#logo").addClass("m-l220");





  }
  backToPreviousPage() {
    this._location.back();
  }
  socialSignIn() {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this._socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this._spinner.show();
        this._auth.googleLogin({ email: userData.email }).subscribe((data) => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully LoggedIn' });
          this.isLoggedIn = true;
          this._userService.sendLogout(true);
          this._auth.setToken(data);
          this._userService.sendAdmin(this._adminService.isAdmin());
          this.assingAdmin();
          if (this._router.url == '/login') {
            this._location.back();
          }
          this._appService.sendIsLoggedin(true);
          this._spinner.hide();
          this._detailedNoticeService.initUser();
        }, (reason) => {
          this._messageService.add({ severity: 'error', summary: 'Login Failure', detail: 'You must be an argusoft user to login.' });
          this._spinner.hide();
        })
      }, (reason) => {
        this._messageService.add({ severity: 'error', summary: 'Login Failure', detail: 'Failed To Login' });
      })
  }
}
