import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {

  form: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  questions: string[] = [];

  showNew = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // 🔹 Load security questions
  loadQuestions() {

    const username = this.form.value.username;
    if (!username) return;

    this.auth.getSecurityQuestions(username)
      .subscribe({
        next: (res: string[]) => {
          this.questions = res;
        },
        error: () => {
          this.errorMessage = 'User not found';
        }
      });
  }

  submit() {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.auth.forgotPassword({
      username: this.form.value.username,
      question: this.form.value.question,
      answer: this.form.value.answer,
      newPassword: this.form.value.newPassword
    })
    .subscribe({
      next: () => {
        this.successMessage = 'Password reset successful';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage =
          err.error?.message || 'Reset failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}