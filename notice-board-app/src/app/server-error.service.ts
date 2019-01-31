import { Injectable } from '@angular/core';
import { AuthService } from 'angular-6-social-login';
import { AuthServices } from './user-authentication/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ServerErrorService {

  constructor(private _router: Router, private _auth: AuthServices) { }
  serverError() {
    this._auth.logout();
    this._router.navigate(['login']);

  }
}
