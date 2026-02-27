import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { StatsCard } from '../../shared/components/stats-card/stats-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinner,
    StatsCard
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {

  data: any;
  isLoading = false;

  get securityScore(): number {
    if (!this.data) return 0;

    const total = this.data.totalPasswords;
    const weak = this.data.weakPasswords;
    const reused = this.data.reusedPasswords;

    if (total === 0) return 100;

    const risk = (weak + reused) / total;
    return Math.max(0, Math.round(100 - risk * 100));
  }

}