import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor.html',
  styleUrls: ['./two-factor.scss']
})
export class TwoFactor implements OnInit {

  otp = '';
  secret = '';
  message = '';
  loading = false;

  enabling = false;
  twoFactorEnabled = false;

  constructor(private auth: AuthService) {}

  // ================= LOAD STATUS =================

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.auth.get2FAStatus().subscribe({
      next: (res: any) => {
        this.twoFactorEnabled = res.enabled;
      },
      error: () => {
        this.twoFactorEnabled = false;
      }
    });
  }

  // ================= ENABLE FLOW =================

  startEnable(): void {

    this.loading = true;
    this.message = '';

    this.auth.enable2FA().subscribe({
      next: (secret: string) => {
        this.secret = secret;
        this.enabling = true;
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Failed to enable';
      },
      complete: () => this.loading = false
    });
  }

  confirmEnable(): void {

    if (!this.otp || this.otp.length !== 6) {
      this.message = 'Enter valid 6-digit code';
      return;
    }

    this.loading = true;

    this.auth.confirm2FA(this.otp).subscribe({
      next: () => {
        this.message = '2FA Enabled Successfully';
        this.resetState();
        this.loadStatus();   
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Invalid code';
        this.loading = false;
      }
    });
  }

  // ================= DISABLE FLOW =================

  disable(): void {

    if (!this.otp || this.otp.length !== 6) {
      this.message = 'Enter valid 6-digit code';
      return;
    }

    this.loading = true;

    this.auth.disable2FA(this.otp).subscribe({
      next: () => {
        this.message = '2FA Disabled Successfully';
        this.resetState();
        this.loadStatus();   // 🔥 IMPORTANT
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Invalid code';
        this.loading = false;
      }
    });
  }

  // ================= RESET =================

  private resetState(): void {
    this.otp = '';
    this.secret = '';
    this.enabling = false;
    this.loading = false;
  }
}