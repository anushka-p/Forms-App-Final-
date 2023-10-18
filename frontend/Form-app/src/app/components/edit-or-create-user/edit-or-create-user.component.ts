import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.services';
import { AuthService } from 'src/app/services/auth.service';
import jwtDecode from 'jwt-decode';
@Component({
  selector: 'app-edit-or-create-user',
  templateUrl: './edit-or-create-user.component.html',
  styleUrls: ['./edit-or-create-user.component.css']
})
export class EditOrCreateUserComponent implements OnInit, OnDestroy{

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService, private router: Router, 
    private adminService: AdminService) {}
  heading:string = '';
  formType:string= '';
  username: string ='';
  useremail: string ='';
  password:string = '';
  confirmPass:string = '';
  state: string = '';
  role: string= '';
  createdby:string = '';
  updatedby:string='';
  errorMessage: string = '';
  userData = {};
  userid:any='';
  routeParamObservable:any;

  onEditDetails()
  {
    //To fill the updatedby column in the database
    const token = localStorage.getItem('token');
    if(token)
    {
      const decoded:any = jwtDecode(token);
      const updatedByid = decoded.user_id;
      this.updatedby = updatedByid;
      
      this.adminService.editUserById(this.userid, this.username, this.useremail, this.state, this.role, this.updatedby, token).subscribe({
        next:(response)=>{
          this.router.navigateByUrl('home/admin-home');
        },error: (err)=>{
          console.log(err);
        }
      })
    } 
   
  }

  onCreateUser()
    {
      this.createdby = this.username;
    this.updatedby = this.username;
    
    this.authService.register(this.username, this.useremail,this.password,this.state,this.role,this.createdby,this.updatedby).subscribe({
      next: (response)=>{
        this.router.navigateByUrl('home/admin-home'); 
      },error:(err)=>{
        this.errorMessage = err.error.message;
      }
    })
      
    }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token)
    {
      //this.userid = this.activatedRoute.snapshot.paramMap.get('id');
     this.routeParamObservable=  this.activatedRoute.paramMap.subscribe((param)=>{
        this.userid = param.get('id');
      })
      if(this.userid)
      {
        this.formType = 'edit';
        this.adminService.getUserById(this.userid,token).subscribe({
          next:(response)=>{
            this.heading = 'Edit User';
            this.username = response.data.username;
            this.useremail= response.data.useremail;
            this.state = response.data.state;
            this.role = response.data.role;
          }
        })
      }
      else{
        this.formType = 'create';
        this.heading = 'Create User';
      }
    }
  }

  ngOnDestroy(){
    this.routeParamObservable.unsubscribe();
  }

}
