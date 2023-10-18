import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AdminService } from 'src/app/services/admin.services';
import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { AddControlsService } from 'src/app/services/addcontrols.services';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements OnInit {
  reactiveForm: FormGroup;

  createdby: string = '';
  updatedby: string = '';
  version: number;
  formFields = {};
  successMsg: string = '';
  routeParamObservable!: any;
  formid: any;
  formData: any;
  controlsArray: any = [];
  formSubmitted:boolean =false;
  status:string = '';
  constructor(
    private fb: FormBuilder,
    private adminServices: AdminService,
    private router: Router,
    private addControlsService: AddControlsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.routeParamObservable = this.activatedRoute.paramMap.subscribe(
        (param) => {
          this.formid = param.get('id');
          if (this.formid) {
            this.adminServices.getFormById(this.formid, token).subscribe({
              next: (response) => {
                this.formData = response.data;
                this.controlsArray = this.formData.formfields.controls;
                console.log(this.controlsArray);
                console.log( this.formData.title);
                const controlsArray = this.reactiveForm.get('controls') as FormArray;
                controlsArray.clear();
          
                // Loop through formfields and create controls
                for (const field of this.controlsArray) {
                  const control = this.createControl(field.type);
                  control.patchValue({ label: field.label });
                  if (field.options) {
                    const optionsArray = control.get('options') as FormArray;
                    optionsArray.clear(); // Clear any existing options
                
                    for (const option of field.options) {
                      const optionGroup = this.createOption();
                      optionGroup.patchValue({ value: option.value }); // Set the option value
                      optionsArray.push(optionGroup);
                    }
                  }
                  controlsArray.push(control);
                }
                this.reactiveForm.patchValue({
                  title: this.formData.title,
                  description: this.formData.description,
                  state: this.formData.state,
                  // isChecked: this.formData.isChecked,
                });
              },
            });
          }
        }
      );
    }

    this.reactiveForm = this.fb.group({
      title:  '',
      description: '',
      state: '',
      isChecked: [true],
      controls: this.fb.array([]),
    });

  }

  addTextControl() {
    const controlsArray = this.reactiveForm.get('controls') as FormArray;
    controlsArray.push(this.addControlsService.createTextControl());
  }

  addNumericControl() {
    const controlsArray = this.reactiveForm.get('controls') as FormArray;
    controlsArray.push(this.addControlsService.createNumericControl());
  }
  addDropdownControl() {
    const controlsArray = this.reactiveForm.get('controls') as FormArray;
    controlsArray.push(this.addControlsService.createDropdownControl());
  }
  addCheckboxControl() {
    const controlsArray = this.reactiveForm.get('controls') as FormArray;
    controlsArray.push(this.addControlsService.createCheckboxControl());
  }
  removeControl(index: number) {
    const controlsArray = this.reactiveForm.get('controls') as FormArray;
    controlsArray.removeAt(index);
  }
  addTextareaControl() {
    const controlsArray = this.reactiveForm.get('controls') as FormArray;
    controlsArray.push(this.addControlsService.createTextareaControl());
  }
  createOption() {
    const optionUuid = uuidv4(); // Generate a unique ID for the option
    return this.fb.group({
      id: optionUuid,
      value: [null, Validators.required], // Assuming the option has a 'value'
    });
  }

  addOption(control: FormGroup) {
    const optionsArray = control.get('options') as FormArray;
    optionsArray.push(this.createOption());
  }

  removeOption(control: FormGroup, index: number) {
    const optionsArray = control.get('options') as FormArray;
    optionsArray.removeAt(index);
  }

  confirmLabel(control: FormGroup) {
    control.get('labelConfirmed').setValue(true);
  }
  addChecklistControl() {
    const controlsArray = this.reactiveForm.get('controls') as FormArray;
    controlsArray.push(this.addControlsService.createChecklistControl());
  }
  addChecklistOption(control: FormGroup) {
    const optionsArray = control.get('options') as FormArray;
    optionsArray.push(this.createOption());
  }

  onSubmit() {
    this.formSubmitted = true; // Set the form as submitted

  const controlsArray = this.reactiveForm.get('controls') as FormArray;
  if (controlsArray.length === 0) {
    this.successMsg = 'Please add at least one control.';
    return; // Prevent form submission
  }
  for (const control of controlsArray.controls) {
    const controlType = control.get('type').value;
    const labelConfirmed = control.get('labelConfirmed').value;

    if (!labelConfirmed) {
      this.successMsg = 'Please confirm the label for all controls.';
      return; // Prevent form submission
    }

    if ((controlType === 'radio' || controlType === 'dropdown'|| controlType === 'checklist') && !control.get('options').value.length) {
      this.successMsg = 'Please add at least one option for radio, dropdown and checklist controls.';
      return; // Prevent form submission
    }
    else{
      const optionsArray = control.get('options') as FormArray;
      if(optionsArray)
      {
        for (const option of optionsArray.controls) {
          const optionLabel = option.get('value').value; 
          if (!optionLabel) {
            this.successMsg = 'Please provide a label for all options of radio or dropdown controls.';
            return; // Prevent form submission
          }
        }
      }
      
    }
  }

  // Check if the required fields are not empty
  if(
    this.reactiveForm.get('title').value &&
    this.reactiveForm.get('description').value &&
    this.reactiveForm.get('state').value)
    {
    const token = localStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      this.createdby = decode.role;
      this.updatedby = decode.role;
      this.version = 0;
      const formControls = {
        controls: this.reactiveForm.get('controls').value,
      };
      const newval = {
        createdby: this.createdby,
        updatedby: this.updatedby,
        version: this.version,
        title: this.reactiveForm.get('title').value,
        description: this.reactiveForm.get('description').value,
        state: this.reactiveForm.get('state').value,
        isChecked: this.reactiveForm.get('isChecked').value,
        status:'new'
      };
      const obj = { formControls, ...newval };      
      if(this.formid !== undefined && this.formid !== null){
        obj.version++;
        obj.status = 'edited';
        this.adminServices.createForm(token, obj).subscribe({
          next: (response) => {
            this.successMsg = 'Form Edited Successfully';
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
      else{
        this.adminServices.createForm(token, obj).subscribe({
          next: (response) => {
            this.successMsg = 'Form Created Successfully';
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
     
    }
  }
  else{
    this.successMsg = 'Please fill in all the required fields.';
  }
  }
  drop(event: CdkDragDrop<FormGroup<any>[]>) {
    if (!(event.previousContainer === event.container)) {
      const controlsArray = this.reactiveForm.get('controls') as FormArray;
      const type = event.item.data;
      controlsArray.push(this.createControl(type));
    }
  }
  createControl(
    type: 'text' | 'numeric' | 'radio' | 'dropdown' | 'checkbox' | 'textarea'
  ): FormGroup {
    if (type === 'text') {
      return this.addControlsService.createTextControl();
    } else if (type === 'numeric') {
      return this.addControlsService.createNumericControl();
    } else if (type === 'radio') {
      return this.addControlsService.createRadioControl();
    } else if (type === 'dropdown') {
      return this.addControlsService.createDropdownControl();
    } else if (type === 'checkbox') {
      return this.addControlsService.createCheckboxControl();
    } else if (type === 'textarea') {
      return this.addControlsService.createTextareaControl();
    } else if (type === 'checklist') {
      return this.addControlsService.createChecklistControl();
    }
    return null;
  }

  onCheckboxChange() {}
  handleClose() {
    if(this.successMsg === 'Form Created Successfully'|| this.successMsg === 'Form Edited Successfully')
    {
      this.successMsg = '';
      this.reactiveForm.reset();
     this.router.navigate(['home/admin-home/view-forms'])
    }else{
      this.successMsg = '';
    }
   
  }
}
