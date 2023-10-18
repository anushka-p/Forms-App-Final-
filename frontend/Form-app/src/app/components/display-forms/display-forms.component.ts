import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.services';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-display-forms',
  templateUrl: './display-forms.component.html',
  styleUrls: ['./display-forms.component.css'],
})
export class DisplayFormsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private adminServices: AdminService,
    private router: Router
  ) {}

  routeParamObservable: any;
  formid: any;
  formData: any = {};
  controlsArray: any = [];
  formresponse: any = {};
  submittedby!: any;
  isfilled!: boolean;
  createdAt!: number;
  errorMessage: string = '';
  isFormFilled: boolean = true;
  selectedOption:any;

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.routeParamObservable = this.activatedRoute.paramMap.subscribe(
        (param) => {
          this.formid = param.get('id');
        }
      );

      if (this.formid) {
        this.adminServices.getFormById(this.formid, token).subscribe({
          next: (response) => {
            this.formData = response.data;
            this.controlsArray = this.formData.formfields.controls;
            console.log(this.controlsArray);
            
            this.createdAt = this.formData.createdat;
            const decoded: any = jwtDecode(token);
            this.submittedby = decoded.user_id;

            this.adminServices
              .getFormControls(token, this.submittedby, this.formid)
              .subscribe({
                next: (res) => {
                  const controlData = res.data[0]?.formdata || {};
                  console.log(controlData, "controldaata");
                  
                  if (Object.keys(controlData).length !== 0) {
                    this.isfilled = true;
                    this.controlsArray.forEach((control) => {
                      const key = `${control.id} - ${control.label}`;
                      if (key in controlData) if (control.type === 'checklist') {
                        // For a checklist, set selected property for options
                        const selectedOptionIds = controlData[key];
                        control.options.forEach(option => {
                          option.selected = selectedOptionIds.includes(option.id);
                        });
                      } else {
                        control.value = controlData[key];
                      }
                    });

                    // Set selectedOption for radio buttons
                    this.controlsArray.forEach((control) => {
                      const key = `${control.id} - ${control.label}`;
                      if (control.type === 'radio') {
                        if (key in controlData) { // Check if the key exists in controlData
                          control.selectedOption = controlData[key]; // Assign the value
                        }
                      }
                      
                    });
                    this.controlsArray.forEach((control) => {
                      const key = `${control.id} - ${control.label}`;
                      if (control.type === 'dropdown') {
                        if (key in controlData) {
                          this.selectedOption = controlData[key];
                        }
                      }
                    });
                  } else {
                    this.isfilled = false;
                  }
                },
              });
          },
        });
      }
    }
    
  }
  submitData() {
    // Reset error message
  this.errorMessage = '';

  // Reset isFormFilled flag
  this.isFormFilled = true;

  // Prepare the form response
  this.formresponse = {};
 
  for (let control of this.controlsArray) {
    const key = `${control.id} - ${control.label}`;
    if (control.type === 'radio') {
      if (!control.selectedOption) {
        this.isFormFilled = false;
      } else {
        this.formresponse[key] = control.selectedOption;      }
    }else if(control.type === 'dropdown')
    {
        if(!this.selectedOption){
          this.isFormFilled = false;
        }
        else{
          this.formresponse[key] = this.selectedOption;        }
    } else if (control.type === 'checklist') {
      // For a checklist, we need to handle multiple selected options
      const selectedOptions = control.options.filter(option => option.selected);
      if (selectedOptions.length > 0) {
        this.formresponse[key] = selectedOptions.map(option => option.id);
           } else {
        this.isFormFilled = false;
      }
    }
    else {
      if (!control.value) {
        this.isFormFilled = false;
      } else {
        this.formresponse[key] = control.value;      }
    }
  }

  // Handle form submission
  if (!this.isFormFilled) {
    this.errorMessage = 'Please fill out all fields before submitting.';
    return;
  }
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);
      this.submittedby = decoded.user_id;

      this.adminServices
        .createFormResponse(token, {
          formresponse: this.formresponse,
          submittedby: this.submittedby,
          formid: this.formid,
        })
        .subscribe({
          next: (res) => {
            this.router.navigateByUrl('home/user-home/to-submit-forms');
          },
        });
    }
  }

  handleClose() {
    this.errorMessage = '';
  }
}
