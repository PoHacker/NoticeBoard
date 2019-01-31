import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'angular-6-social-login';
import { AuthServices } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _route: Router, private _authServices: AuthServices, private _userService: UserService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authServices.userExists()) {
      this._userService.sendLogout(true);
      return true;
    } else {
      this._route.navigate(["login"]);
      return false;
    }
  }
}
