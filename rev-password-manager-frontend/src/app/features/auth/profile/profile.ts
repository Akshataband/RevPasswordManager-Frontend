import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {

  form: FormGroup;

  loading = false;
  message = '';

  twoFactorEnabled = false;
  secret = '';
  otp = '';
  showOtpInput = false;
  enabling = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
    });
  }

  ngOnInit() {
    this.load2FAStatus();
  }

  // ================= PROFILE UPDATE =================

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.auth.updateProfile(this.form.value).subscribe({
      next: () => this.message = 'Profile updated successfully',
      error: () => this.message = 'Update failed',
      complete: () => this.loading = false
    });
  }

  // ================= LOAD 2FA STATUS =================

  load2FAStatus() {
    this.auth.get2FAStatus().subscribe({
      next: (res: any) => {
  this.twoFactorEnabled = res.enabled;
}
    });
  }

  // ================= ENABLE FLOW =================

  startEnable() {
    this.enabling = true;

    this.auth.enable2FA().subscribe({
      next: (secret) => {
        this.secret = secret;
        this.showOtpInput = true;
        this.message = 'Scan this secret in your authenticator app';
      }
    });
  }

  confirmEnable() {
    this.auth.confirm2FA(this.otp).subscribe({
      next: () => {
        this.message = '2FA Enabled Successfully';
        this.reset2FAState();
        this.load2FAStatus();
      },
      error: () => this.message = 'Invalid OTP'
    });
  }

  // ================= DISABLE FLOW =================

  startDisable() {
    this.enabling = false;
    this.showOtpInput = true;
  }

  confirmDisable() {
    this.auth.disable2FA(this.otp).subscribe({
      next: () => {
        this.message = '2FA Disabled Successfully';
        this.reset2FAState();
        this.load2FAStatus();
      },
      error: () => this.message = 'Invalid OTP'
    });
  }

  private reset2FAState() {
    this.secret = '';
    this.otp = '';
    this.showOtpInput = false;
  }
}