import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.services';
import jwtDecode from 'jwt-decode';
@Component({
  selector: 'app-submitted-forms',
  templateUrl: './submitted-forms.component.html',
  styleUrls: ['./submitted-forms.component.css']
})
export class SubmittedFormsComponent {

  forms: any = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
  
    if (token) {
      this.adminService.getForms(token).subscribe({
        next: (response) => {
          if (Array.isArray(response.data)) {
            this.forms = [...response.data];
            const decoded: any = jwtDecode(token);
            const userId = decoded.user_id;
  
            this.adminService.getSubmittedForms(token, userId).subscribe({
              next: (res) => {
                const filledForms = res.data.map(item => item.formid);
                this.forms = this.forms.filter(form => filledForms.includes(parseInt(form.id, 10)));
              },
            });
          }
        },
        error: (err) => {},
      });
    }
  }
}
