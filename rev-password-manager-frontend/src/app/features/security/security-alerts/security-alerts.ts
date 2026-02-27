import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-security-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './security-alerts.html',
  styleUrls: ['./security-alerts.scss']
})
export class SecurityAlerts {

  masterPassword = '';
  alerts: string[] = [];
  loading = false;
  errorMessage = '';
  alertsLoaded = false;

  constructor(private auth: AuthService) {}

  loadAlerts() {

    if (!this.masterPassword) {
      this.errorMessage = 'Master password is required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.alertsLoaded = true;

    this.auth.getSecurityAlerts(this.masterPassword)
      .subscribe({
        next: (res: any) => {
          this.alerts = res?.alerts || [];
          this.loading = false;
        },
        error: (err) => {
          this.alerts = [];
          this.loading = false;
          this.errorMessage =
            err?.error?.message || 'Invalid master password';
        }
      });
  }

  reset() {
    this.masterPassword = '';
    this.alerts = [];
    this.alertsLoaded = false;
    this.errorMessage = '';
  }
}