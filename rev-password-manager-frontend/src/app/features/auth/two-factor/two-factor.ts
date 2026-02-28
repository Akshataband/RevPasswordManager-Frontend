import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor.html',
  styleUrls: ['./two-factor.scss']
})
export class TwoFactor implements OnInit {

  isEnabled = false;
  isLoading = true;

  qrCode: string | null = null;

  confirmCode = '';   // used for enabling
  disableCode = '';   // used for disabling

  errorMessage = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus() {
    this.isLoading = true;

    this.auth.get2FAStatus().subscribe({
      next: (res: boolean) => {
        this.isEnabled = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  enable2FA() {
    this.errorMessage = '';

    this.auth.enable2FA().subscribe({
      next: (res: any) => {
        const otpUrl = res.qr;

        // Convert otpauth URL into real QR image
        this.qrCode =
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='
          + encodeURIComponent(otpUrl);
      },
      error: () => {
        this.errorMessage = 'Failed to generate QR code';
      }
    });
  }

  confirm2FA() {
    if (!this.confirmCode.trim()) {
      this.errorMessage = 'OTP is required';
      return;
    }

    this.errorMessage = '';

    this.auth.confirm2FA(this.confirmCode.trim()).subscribe({
      next: () => {
        this.qrCode = null;
        this.confirmCode = '';
        this.loadStatus();
      },
      error: (err) => {
        this.errorMessage = 'Invalid or expired OTP';
      }
    });
  }

  disable2FA() {
    if (!this.disableCode.trim()) {
      this.errorMessage = 'OTP is required';
      return;
    }

    this.errorMessage = '';

    this.auth.disable2FA(this.disableCode.trim()).subscribe({
      next: () => {
        this.disableCode = '';
        this.loadStatus();
      },
      error: () => {
        this.errorMessage = 'Invalid OTP';
      }
    });
  }
}