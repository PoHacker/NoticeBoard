import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdminService } from './admin.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private _router:Router, private _adminService: AdminService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this._adminService.isAdmin()){
        return true;
      }else{
        this._router.navigate(['dashboard']);
        return false;
      }
  }
}
