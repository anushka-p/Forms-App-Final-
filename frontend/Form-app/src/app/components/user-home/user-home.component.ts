import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AdminService } from 'src/app/services/admin.services';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit{
  constructor(private adminService: AdminService, private route: Router) {}
  user: any = {};
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token)
    {
      const decoded:any = jwtDecode(token);
      
      this.adminService.getUserById(decoded.user_id, token).subscribe({
        next:(response)=>{
          this.user = response.data;
        }
      })
    }
   //testinggg
   const cookiesString = document.cookie;

   // Split the string into individual cookies
   const cookiesArray = cookiesString.split('; ');   
   // Loop through the cookies to extract values
   const cookieValues = {};
   cookiesArray.forEach(cookie => {
       const parts = cookie.split('=');
       const name = parts[0];
       const value = decodeURIComponent(parts[1]);
       cookieValues[name] = value;
   });
   const gCsrfToken = cookieValues['g_csrf_token'];
   console.log(gCsrfToken);
  }
  toEdit()
  {
    this.route.navigateByUrl('home/user-home/to-submit-forms')
  }
  toSubmitted()
  {
    this.route.navigateByUrl('home/user-home/submitted-forms')
  }

}
