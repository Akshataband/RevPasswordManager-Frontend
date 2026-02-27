import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      masterPassword: ['', Validators.required]
    });
  }

  submit() {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.auth.login(this.form.value).subscribe({
    next: (res: any) => {

      // ✅ Direct JWT login (2FA disabled)
      if (res.token && !res.otpRequired) {

        this.auth.setToken(res.token);
        this.router.navigate(['/dashboard']);
        return;
      }

      // ✅ OTP required (2FA enabled)
      if (res.otpRequired) {

        this.auth.setTempUsername(this.form.value.username);
        this.router.navigate(['/verify-2fa']);
        return;
      }

      // ⚠ fallback safety
      this.errorMessage = 'Unexpected login response';
    },
    error: (err) => {
      this.errorMessage =
        err.error?.message || 'Invalid credentials';
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
    }
  });
}}