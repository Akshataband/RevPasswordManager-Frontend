import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-view-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-password-modal.html',
  styleUrls: ['./view-password-modal.scss']
})
export class ViewPasswordModal {

  @Input() passwordId!: number;
  @Output() close = new EventEmitter<void>();

  masterPassword = '';
  revealedPassword: string | null = null;
  error = '';
  isLoading = false;

  constructor(private auth: AuthService) {}

  reveal() {
    console.log("Reveal clicked");
    console.log("ID:", this.passwordId);
    console.log("Master:", this.masterPassword);

    if (!this.masterPassword) {
      this.error = 'Master password required';
      return;
    }

    this.isLoading = true;

    this.auth.viewPassword(this.passwordId, this.masterPassword)
      .subscribe({
        next: (res: any) => {
  console.log("Response:", res);

  this.error = ''; // ✅ clear old error
  this.revealedPassword = res.password;
  this.isLoading = false;
},
        error: (err) => {
          console.log("Error:", err);
          this.error = 'Invalid master password';
          this.isLoading = false;
        }
      });
  }

  closeModal() {
    this.masterPassword = '';
    this.revealedPassword = null;
    this.error = '';
    this.isLoading = false;
    this.close.emit();
  }
}