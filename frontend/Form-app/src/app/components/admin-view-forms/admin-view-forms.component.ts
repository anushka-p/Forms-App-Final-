import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.services';
@Component({
  selector: 'app-admin-view-forms',
  templateUrl: './admin-view-forms.component.html',
  styleUrls: ['./admin-view-forms.component.css'],
})
export class AdminViewFormsComponent {
  forms: any = [];
  successMsg:string = '';
  formid:number = 0;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadForms();
  }

  loadForms()
  {
    const token = localStorage.getItem('token');

    if (token) {
      this.adminService.getForms(token).subscribe({
        next: (response) => {
          if (Array.isArray(response.data)) {
            this.forms = [...response.data];
          }
        },
        error: (err) => {},
      });
    }
  }
  
  deleteForm(id:number)
  {
    this.formid = id;
    this.successMsg = 'Are you sure you wantt to delete?';
  }
  handleClose()
  {
    this.successMsg ='';
    this.loadForms()
  }
  handleOkClick()
  {
    const token = localStorage.getItem('token');
      if(token)
      {    
        this.adminService.deleteFormById(token, this.formid).subscribe({
          next:(res)=>
          {
            console.log(res);
          }
        })
  
      }
      this.successMsg = '';
  }
}
