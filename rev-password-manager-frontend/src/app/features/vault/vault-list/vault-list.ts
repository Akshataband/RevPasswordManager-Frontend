import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ViewPasswordModal } from '../../../shared/components/view-password-modal/view-password-modal';

@Component({
  selector: 'app-vault-list',
  standalone: true,
  imports: [

  CommonModule,
    FormsModule,
    LoadingSpinner,
    ConfirmDialog,
    ViewPasswordModal
  ],
  templateUrl: './vault-list.html',
  styleUrls: ['./vault-list.scss']
})
export class VaultList implements OnInit {

  passwords: any[] = [];

  search = '';
  category = '';
  sortBy = 'createdAt';
  direction = 'desc';

  page = 0;
  size = 5;

  totalPages = 0;
  totalElements = 0;

  loading = true;
  showFavorites = false;

  deleteId: number | null = null;
  selectedId: number | null = null;

  categories = [
    'Social Media',
    'Banking',
    'Email',
    'Shopping',
    'Work',
    'Other'
  ];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPasswords();
  }

  // ================= LOAD =================
  loadPasswords() {
    this.loading = true;

    if (this.showFavorites) {
      this.auth.getFavorites().subscribe({
        next: (res: any[]) => {
          this.passwords = res || [];
          this.loading = false;
        },
        error: () => this.loading = false
      });
    } else {
      const params = {
        search: this.search || '',
        category: this.category || '',
        page: this.page,
        size: this.size,
        sortBy: this.sortBy,
        direction: this.direction
      };

      this.auth.searchVault(params).subscribe({
        next: (res: any) => {
          this.passwords = res?.content || [];
          this.totalPages = res?.totalPages || 0;
          this.totalElements = res?.totalElements || 0;
          this.page = res?.number || 0;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  applyFilters() {
    this.page = 0;
    this.loadPasswords();
  }

  changeSort(field: string) {
    if (this.sortBy === field) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.direction = 'asc';
    }
    this.loadPasswords();
  }

  toggleFavorite(item: any) {
    const request$ = item.favorite
      ? this.auth.removeFromFavorite(item.id)
      : this.auth.addToFavorite(item.id);

    request$.subscribe({
      next: () => {
        item.favorite = !item.favorite;
        if (this.showFavorites && !item.favorite) {
          this.passwords = this.passwords.filter(p => p.id !== item.id);
        }
      }
    });
  }

  toggleShowFavorites() {
    this.showFavorites = !this.showFavorites;
    this.page = 0;
    this.loadPasswords();
  }

  // ===== DELETE WITH MODAL =====
  confirmDelete(id: number) {
    this.deleteId = id;
  }

  deletePassword() {
    if (!this.deleteId) return;

    this.auth.deletePassword(this.deleteId).subscribe(() => {
      this.loadPasswords();
      this.deleteId = null;
    });
  }

  // ===== NAVIGATION =====
  goToAdd() {
    this.router.navigate(['/add-password']);
  }

  editPassword(id: number) {
    this.router.navigate(['/edit-password', id]);
  }

  // ===== VIEW MODAL =====
  viewPassword(id: number) {
    this.selectedId = id;
  }

  closeModal() {
    this.selectedId = null;
  }

  // ===== PAGINATION =====
  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadPasswords();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadPasswords();
    }
  }

  goToPage(p: number) {
    this.page = p;
    this.loadPasswords();
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }
}