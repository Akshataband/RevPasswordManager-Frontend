import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {

  form: FormGroup;

  loading = false;
  message = '';
  user: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  // ================= LOAD USER =================

  loadUserProfile() {
    this.loading = true;

    this.auth.getCurrentUser().subscribe({
      next: (res: any) => {
        this.user = res;

        // Patch values into form
        this.form.patchValue({
          name: res.name,
          email: res.email,
          phoneNumber: res.phoneNumber
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ================= PROFILE UPDATE =================

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.auth.updateProfile(this.form.value).subscribe({
      next: () => {
        this.message = 'Profile updated successfully';
        this.loading = false;
      },
      error: () => {
        this.message = 'Update failed';
        this.loading = false;
      }
    });
  }
}