import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loggedUser:string= '';
  errorMessage:string = '';
  constructor(private authService: AuthService,private router: Router) {}

  onLogin() {
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          const decodedToken: any = jwt_decode(token);
  
        // Extract user role (assuming it's stored in a field called 'role')
        const userRole = decodedToken.role;
  
        // Redirect based on user role
        if(token !== null)
        {
          if (userRole === 'admin') {
            this.loggedUser = 'admin';
            this.router.navigate(['/home/admin-home']); 
            
          } else if (userRole === 'user') {
            this.loggedUser = 'user';
            this.router.navigate(['/home/user-home']); 
          } else {
            //error
          }
            // Redirect or perform further actions
          }
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = err.error.message|| 'An Error Occurred';
        }
      });
    
  }
  // onSignIn() {
  //   console.log("running");
    
  //   gapi.load('auth2', () => {
  //     gapi.auth2.init({
  //       client_id: 'YOUR_CLIENT_ID', // Replace with your client ID
  //     }).then(() => {
  //       const auth2 = gapi.auth2.getAuthInstance();
  //       if (auth2.isSignedIn.get()) {
  //         const googleUser = auth2.currentUser.get();
  //         const profile = googleUser.getBasicProfile();

  //         const id = profile.getId();
  //         const name = profile.getName();
  //         const email = profile.getEmail();
  //         const imageUrl = profile.getImageUrl();

  //         console.log("ID: " + id);
  //         console.log("Name: " + name);
  //         console.log("Email: " + email);
  //         console.log("Image URL: " + imageUrl);
  //       }
  //     });
  //   });
  // }
    handleClose() {
      this.errorMessage = '';
  }
  }

  
 

