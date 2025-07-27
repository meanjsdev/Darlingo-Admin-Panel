import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css']
})
export class ConfirmDialog {
  @Output() confirmed = new EventEmitter<boolean>();
  message = 'Are you sure you want to delete this item?';
  confirmText = 'Delete';
  cancelText = 'Cancel';

  onConfirm() {
    this.confirmed.emit(true);
  }

  onCancel() {
    this.confirmed.emit(false);
  }
}
