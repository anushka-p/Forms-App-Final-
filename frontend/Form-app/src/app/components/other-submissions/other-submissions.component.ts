import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-other-submissions',
  templateUrl: './other-submissions.component.html',
  styleUrls: ['./other-submissions.component.css']
})
export class OtherSubmissionsComponent {
  formid: any;
  otherSubData:any =[]
  tableHeading:string ='';
  state:string = '';
  isVisible:boolean = false;
  constructor(
    private adminservice: AdminService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe(param => {
      this.formid = param.get('id');
      this.state = param.get('state');
      this.loadSubmissions();
      this.isVisible = true;
    });
  }

  loadSubmissions() {
    
    const token = localStorage.getItem('token');
    if (token) {
      this.adminservice.getOtherSubmission(token, this.formid).subscribe({
        next: res => {
         if(res.data.length === 0){
          this.tableHeading = 'No Other Submissions yet!'
         }
         else{
          this.tableHeading = 'Other Submissions'
          this.otherSubData = res.data
         }
        }
      });
    }
  }

  closeComponent()
{
 this.isVisible = !this.isVisible;
 console.log(this.isVisible);
 
  
}
}


