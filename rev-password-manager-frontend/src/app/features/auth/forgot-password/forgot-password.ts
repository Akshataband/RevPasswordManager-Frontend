import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {

  verifyForm: FormGroup;
  resetForm: FormGroup;

  step = 1;
  message = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {

    this.verifyForm = this.fb.group({
      username: ['', Validators.required],
      answer: ['', Validators.required]
    });

    this.resetForm = this.fb.group({
      username: ['', Validators.required],
      newMasterPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  verifyAnswer() {

    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.auth.verifySecurityAnswer(this.verifyForm.value)
      .subscribe({
        next: () => {
          this.step = 2;

          this.resetForm.patchValue({
            username: this.verifyForm.value.username
          });
        },
        error: () => {
          this.message = 'Incorrect security answer';
          this.loading = false;
        },
        complete: () => this.loading = false
      });
  }

  resetPassword() {

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.auth.resetMasterPassword(this.resetForm.value)
      .subscribe({
        next: () => {
          this.message = 'Password reset successfully';
        },
        error: () => {
          this.message = 'Reset failed';
          this.loading = false;
        },
        complete: () => this.loading = false
      });
  }
}