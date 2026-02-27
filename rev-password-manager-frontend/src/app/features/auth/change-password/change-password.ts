import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss']
})
export class ChangePassword {

  verifyForm: FormGroup;
  resetForm: FormGroup;

  step = 1;
  loading = false;
  message = '';

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
      currentMasterPassword: ['', Validators.required],
      newMasterPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // ================= STEP 1 =================

  verifyAnswer() {

    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

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

  // ================= STEP 2 =================

  resetPassword() {

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    this.auth.resetMasterPassword(this.resetForm.value)
      .subscribe({
        next: () => {
          this.message = 'Master password changed successfully';
          this.step = 1;
          this.verifyForm.reset();
          this.resetForm.reset();
        },
        error: () => {
          this.message = 'Password reset failed';
          this.loading = false;
        },
        complete: () => this.loading = false
      });
  }
}