import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService,private router: Router) {}
  username: string ='';
  useremail: string ='';
  password: string = '';
  state: string = '';
  role: string= '';
  createdby:string= '';
  updatedby:string='';
  errorMessage: string = '';
  onRegister()
  {
    this.createdby = this.username;
    this.updatedby = this.username;
    console.log(this.useremail,this.username, this.role, this.createdby);
    
    this.authService.register(this.username, this.useremail,this.password,this.state,this.role,this.createdby,this.updatedby).subscribe({
      next: (response)=>{
        this.router.navigate(['']); 
      },error:(err)=>{
        console.log(err.error.message);
        
        this.errorMessage = err.error.message;
      }
    })
  }
}
