import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { DatePipe } from '@angular/common'



import { AppComponent } from './app.component';
import { LoginComponent } from './user-authentication/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { ShowHidePasswordModule } from 'ngx-show-hide-password'
import { AuthServices } from './user-authentication/services/auth.service'
import { AngularFontAwesomeModule } from 'angular-font-awesome'
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angular-6-social-login";
import { UserService } from './user-authentication/services/user.service';
import { NoticeDetailedComponent } from './dashboard/notice-detailed/notice-detailed.component';
import { DashboardService } from './dashboard/dashboard.service';
import { DataTablesModule } from 'angular-datatables';
import { AdminComponent } from './admin/admin.component';
import { NoticesComponent } from './admin/notices/notices.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin.dashboard.component'
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal'
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AddNoticeComponent } from './dashboard/add-notice/add-notice.component';
import { AdminService } from './admin/admin.service';
import { AuthGuard } from './user-authentication/guard/auth.guard'
import { LoginGuard } from './login.guard';
import { AppService } from './app.service';
import { EditNoticeComponent } from './admin/edit-notice/edit-notice.component';
import { RoleGuard } from './admin/role.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { LSelect2Module } from 'ngx-select2';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { QuillEditorModule } from 'ngx-quill-editor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';






import { LimitTextDirective } from './limit-text.directive';
import { ServerErrorService } from './server-error.service';
import { AddEventComponent } from './admin/add-event/add-event.component';
import { ShowSpinnerComponent } from './show-spinner/show-spinner.component';
import { EventsComponent } from './admin/events/events.component';
import { FilterPipe } from './admin/filter.pipe';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';





export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("516112616667-gf15vnu4rihnao7176n1arqfhjvfq2n2.apps.googleusercontent.com")
      }
    ]
  );
  return config;
}


const appRoutes: Routes = [
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
  { path: 'spinner', component: ShowSpinnerComponent },

  { path: 'noticeDetailed/:id', component: NoticeDetailedComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-notice', canActivate: [AuthGuard], component: AddNoticeComponent },
  {
    path: 'admin', canActivate: [AuthGuard, RoleGuard], component: AdminComponent, children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'notices', component: NoticesComponent },
      { path: 'events', component: EventsComponent },
      { path: 'edit-notice/:id', component: EditNoticeComponent },
      { path: 'add-event', component: AddEventComponent }

    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }


]


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminDashboardComponent,
    AdminDashboardComponent,
    NoticeDetailedComponent,
    AdminComponent,
    NoticesComponent,
    DashboardComponent,
    AddNoticeComponent,
    EditNoticeComponent,
    LimitTextDirective,
    AddEventComponent,
    ShowSpinnerComponent,
    EventsComponent,
    FilterPipe,
    DeleteDialogComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    NgxSpinnerModule,
    RouterModule.forRoot(appRoutes, { useHash: true, onSameUrlNavigation: "ignore" }),
    ReactiveFormsModule,
    ShowHidePasswordModule.forRoot(),
    HttpClientModule,
    AngularFontAwesomeModule,
    SocialLoginModule,
    DataTablesModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),

    BrowserAnimationsModule,
    ToastModule,
    DialogModule,
    LSelect2Module,
    CalendarModule,
    QuillEditorModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [DeleteDialogComponent, NoticeDetailedComponent, FilterPipe, NgxSpinnerService, DatePipe, ServerErrorService, MessageService, AppService, AdminService, AuthServices, LoginGuard, AuthGuard, RoleGuard, UserService, DashboardService, {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
