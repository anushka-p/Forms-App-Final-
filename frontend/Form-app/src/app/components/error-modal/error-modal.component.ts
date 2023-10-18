import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  @Input() title: string;
  @Output() close = new EventEmitter<void>();
  @Output() okClick = new EventEmitter<void>();
  @Input() showOkButton : boolean= false;
  closeDialog() {
    this.close.emit();
  }
  handleOk(){
    this.okClick.emit();
  }
}
