import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rough',
  templateUrl: './rough.component.html',
  styleUrls: ['./rough.component.css']
})
export class RoughComponent implements OnInit {

  showDeleteModal = false;

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  deleteItem() {
    // Implement your delete logic here
    this.closeDeleteModal(); // Close the modal after deletion
  }
ngOnInit(): void {
  
}
}
