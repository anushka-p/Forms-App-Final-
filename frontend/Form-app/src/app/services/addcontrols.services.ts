import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AddControlsService {
  constructor(private fb: FormBuilder) {}

  createTextControl(): FormGroup {
    const controlUuid = uuidv4();
    return this.fb.group({
      id: controlUuid,
      type: 'text',
      label: [null, Validators.required],
      labelConfirmed: this.fb.control(false),
      value: [null, Validators.required],
    });
  }

  createNumericControl(): FormGroup {
    const controlUuid = uuidv4();
    return this.fb.group({
      id: controlUuid,
      type: 'numeric',
      label: [null, Validators.required],
      labelConfirmed: this.fb.control(false),
      value: [null, [Validators.required, Validators.max(5), Validators.min(0)]],
    });
  }

  createRadioControl(): FormGroup {
    const controlUuid = uuidv4();
    return this.fb.group({
      id: controlUuid,
      type: 'radio',
      label: [null, Validators.required],
      labelConfirmed: this.fb.control(false),
      options: this.fb.array([]),
    });
  }

  createOption(): FormGroup {
    const optionUuid = uuidv4();
    return this.fb.group({
      id: optionUuid,
      value: [null, Validators.required],
    });
  }

  createDropdownControl() {
    const controlUuid = uuidv4();
    return this.fb.group({
      id: controlUuid,
      type: 'dropdown',
      label: [null, Validators.required], // Added label form control
      labelConfirmed: this.fb.control(false),
      options: this.fb.array([]),
    });
  }
  createCheckboxControl() {
    return this.fb.group({
      id: uuidv4(),
      type: 'checkbox',
      label: ['', Validators.required],
      labelConfirmed: false,
      value: false, // Assuming checkboxes start as unchecked
    });
  }
  
  createTextareaControl() {
    return this.fb.group({
      id: uuidv4(),
      type: 'textarea',
      label: ['', Validators.required],
      labelConfirmed: false,
      value: '', // Assuming textarea starts as an empty string
    });
  }
  createChecklistControl(): FormGroup {
    const controlUuid = uuidv4();
    return this.fb.group({
      id: controlUuid,
      type: 'checklist', // Add type 'checklist'
      label: [null, Validators.required],
      labelConfirmed: this.fb.control(false),
      options: this.fb.array([]),
    });
  }
  
}
