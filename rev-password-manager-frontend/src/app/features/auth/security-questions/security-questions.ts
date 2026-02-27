import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-view-security-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './security-questions.html',
  styleUrls: ['./security-questions.scss']
})
export class ViewSecurityQuestions implements OnInit {

  questions: string[] = [];
  answers: { question: string; answer: string }[] = [];

  masterPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private service: AuthService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;

    this.service.getQuestions().subscribe({
      next: (res: any) => {
        this.questions = res || [];
        this.answers = this.questions.map(q => ({
          question: q,
          answer: ''
        }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateQuestions() {

    if (!this.masterPassword) {
      this.errorMessage = 'Master password is required';
      return;
    }

    const filledAnswers = this.answers.filter(a => a.answer.trim() !== '');

    if (filledAnswers.length < 3) {
      this.errorMessage = 'Minimum 3 answers required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.updateSecurityQuestions({
  masterPassword: this.masterPassword,
  securityAnswers: filledAnswers
}).subscribe({
      next: () => {
        this.successMessage = 'Security questions updated successfully';
        this.masterPassword = '';
        this.answers.forEach(a => a.answer = '');
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Update failed';
        this.loading = false;
      }
    });
  }
}