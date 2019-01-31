import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private appService: AppService, private _router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appService.isLoggedIn()) {
      this._router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }
  }
}
