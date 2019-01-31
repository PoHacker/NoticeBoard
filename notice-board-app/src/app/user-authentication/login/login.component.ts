import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServices } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { UserService } from '../services/user.service';
import { AdminService } from '../../admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginDetails: FormGroup;

  constructor(private _messageService: MessageService,
    private _adminService: AdminService,
    private _auth: AuthServices,
    private _router: Router,
    private _socialAuthService: AuthService,
    private _userService: UserService,
    private _spinner: NgxSpinnerService) {

  }
  ngOnInit() {
  }
  socialSignIn() {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this._socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this._spinner.show();
        console.log(userData)
        this._auth.googleLogin({ email: userData.email }).subscribe((data) => {
          data.name = data.first_name + " " + data.last_name;
          console.log(data)
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully LoggedIn' });
          this._userService.sendLogout(true);
          this._auth.setToken(data);
          this._userService.sendAdmin(this._adminService.isAdmin());
          this._spinner.hide();
          this._router.navigate(['dashboard']);
        }, (reason) => {
          this._messageService.add({ severity: 'error', summary: 'Login Failure', detail: 'You must be an argusoft user to login.' });
          this._spinner.hide();
        })
      }, (reason) => {
        this._messageService.add({ severity: 'error', summary: 'Login Failure', detail: 'Failed To Login' });
      })
  }
}
