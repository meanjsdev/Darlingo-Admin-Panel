import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  @Input() email: string = '';
  @Output() close = new EventEmitter<void>();
  
  resetForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  success = false;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // You can use this.data.email to pre-fill the email if needed
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Call your authentication service to reset the password
    // Example:
    // this.authService.resetPassword(
    //   this.email,
    //   this.resetForm.value.currentPassword,
    //   this.resetForm.value.newPassword
    // ).subscribe({
    //   next: () => {
    //     this.isLoading = false;
    //     this.success = true;
    //     setTimeout(() => this.closeDialog(), 2000);
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.error = err.message || 'Failed to reset password. Please try again.';
    //   }
    // });
    
    // For now, just simulate a successful reset
    setTimeout(() => {
      this.isLoading = false;
      this.success = true;
      setTimeout(() => this.closeDialog(), 2000);
    }, 1500);
  }

  closeDialog() {
    this.close.emit();
  }

  onCancel() {
    this.closeDialog();
  }
}
