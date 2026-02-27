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
  code = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus() {
  this.auth.get2FAStatus().subscribe({
    next: (res: boolean) => {
      console.log("2FA status:", res);
      this.isEnabled = res;   
      this.isLoading = false;
    },
    error: (err) => {
      console.log("2FA status error:", err);
      this.isLoading = false;
    }
  });
}

  // enable2FA() {
  //   this.auth.enable2FA().subscribe({
  //     next: (res: string) => {
  //       console.log("QR:", res);
  //       this.qrCode = res; // backend should return QR string
  //     }
  //   });
  // }

  enable2FA() {
  this.auth.enable2FA().subscribe({
    next: (res: any) => {
      this.qrCode = res.qr;
    }
  });
}

confirm2FA() {
  this.auth.confirm2FA(this.code).subscribe({
    next: () => {
      this.loadStatus();  
      this.qrCode = null;
      this.code = '';
    }
  });
}

disable2FA() {
  this.auth.disable2FA(this.code).subscribe({
    next: () => {
      this.loadStatus();   
      this.code = '';
    }
  });
}
}