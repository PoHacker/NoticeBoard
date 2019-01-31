import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-authentication/services/user.service';
import { AdminService } from './admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isEvent: boolean = false;


  constructor(private _router: Router, private _userServices: UserService, private _adminService: AdminService) { }

  ngOnInit() {
    this.isEvent = false;
    this._userServices.getEvent().subscribe((value) => {
      if (value['text'] == true) {
        this.isEvent = true;
      } else {
        this.isEvent = false;
      }
    }, (reason) => {
      this.isEvent = false;
    })
    this._userServices.sendAdmin(this._adminService.isAdmin());
  }
  isDashboard;
}
