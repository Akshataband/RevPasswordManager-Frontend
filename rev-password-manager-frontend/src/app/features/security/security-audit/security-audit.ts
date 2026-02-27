import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-security-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './security-audit.html',
  styleUrls: ['./security-audit.scss']
})
export class SecurityAudit {

  masterPassword = '';
  report: any = null;
  loading = false;
  errorMessage = '';
  auditStarted = false;

  constructor(private auth: AuthService) {}

  runAudit() {

    if (!this.masterPassword) {
      this.errorMessage = 'Master password is required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.auditStarted = true;

    this.auth.securityAudit(this.masterPassword)
      .subscribe({
        next: (res: any) => {
          this.report = res || null;
          this.loading = false;
        },
        error: (err) => {
          this.report = null;
          this.loading = false;

          this.errorMessage =
            err?.error?.message || 'Invalid master password';
        }
      });
  }

  reset() {
    this.masterPassword = '';
    this.report = null;
    this.auditStarted = false;
    this.errorMessage = '';
  }
}