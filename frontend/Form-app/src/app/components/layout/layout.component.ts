import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
    constructor(private router: Router) {}
    menuType: string ='';

    logout()
    {
      const token = localStorage.getItem('token');
      if(token){
        localStorage.removeItem('token');
      }
      this.router.navigate(['']);
    }

    ngOnInit(): void {
      this.router.events.subscribe({
        next:(val:any)=>{
         if(val.routerEvent)
        {
          if(localStorage.getItem('token') && val.routerEvent.url.includes('user-home')){
            this.menuType = 'user';
          }
          else if(localStorage.getItem('token') && val.routerEvent.url.includes('admin-home/')){
            this.menuType = 'admin';
          }
          else{
            this.menuType = 'admin-home'
          }
        }
      }})
    }
}
