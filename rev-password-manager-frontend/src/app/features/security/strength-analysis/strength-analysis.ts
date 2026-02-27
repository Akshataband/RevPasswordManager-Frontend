import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-strength-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strength-analysis.html',
  styleUrls: ['./strength-analysis.scss']
})
export class StrengthAnalysis {

  password = '';
  strength = '';

  constructor(private auth: AuthService) {}

  checkStrength() {

    if (!this.password.trim()) return;

    this.auth.checkPasswordStrength(this.password)
      .subscribe((res: any) => {
        this.strength = res.strength;
      });
  }
}