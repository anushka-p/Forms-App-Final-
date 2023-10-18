import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { IsAuthGuard } from './services/auth-guard.service';
import { EditOrCreateUserComponent } from './components/edit-or-create-user/edit-or-create-user.component';
import { RoughComponent } from './components/rough/rough.component';
import { FormsComponent } from './components/forms/forms.component';
import { SubmittedFormsComponent } from './components/submitted-forms/submitted-forms.component';
import { ToSubmitFormsComponent } from './components/to-submit-forms/to-submit-forms.component';
import { DisplayFormsComponent } from './components/display-forms/display-forms.component';
import { OtherSubmissionsComponent } from './components/other-submissions/other-submissions.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { AdminViewFormsComponent } from './components/admin-view-forms/admin-view-forms.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: 'admin-home',
        component: AdminHomeComponent, canActivate: [IsAuthGuard],
      },
      {
        path: 'admin-home/edit-user/:id',
        component: EditOrCreateUserComponent, canActivate: [IsAuthGuard]
      },
      {
        path: 'admin-home/create-user',
        component: EditOrCreateUserComponent, canActivate: [IsAuthGuard]
      },
      {
        path: 'admin-home/create-form',
        component: FormsComponent, canActivate: [IsAuthGuard]
      },
      {
        path: 'admin-home/view-forms/:id',
        component: FormsComponent, canActivate: [IsAuthGuard]
      },
      {
        path: 'admin-home/view-forms',
        component: AdminViewFormsComponent, canActivate: [IsAuthGuard]
      },
      {
        path: 'user-home', 
        component: UserHomeComponent, canActivate: [IsAuthGuard]
      },
      {
        path: 'user-home/submitted-forms', 
        component: SubmittedFormsComponent
      },
      {
        path: 'user-home/submitted-forms/:id', 
        component: DisplayFormsComponent
      },
      {
        path: 'user-home/to-submit-forms', 
        component: ToSubmitFormsComponent, children:[
          {
            path: 'other-submissions/:id/:state',
            component: OtherSubmissionsComponent
          }
        ]
      },
      {
        path: 'user-home/to-submit-forms/:id', 
        component: DisplayFormsComponent
      }
    ]
  },
  {
    path: 'rough',
    component: RoughComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path: 'upload-file',
    component: UploadFileComponent
  },
  // {
  //   path: '**', //wildcard route
    
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
