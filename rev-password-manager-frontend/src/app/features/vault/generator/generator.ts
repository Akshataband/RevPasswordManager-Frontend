import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generator.html',
  styleUrls: ['./generator.scss']
})
export class Generator {
passwords: { password: string; strength: string }[] = []; 
  strength = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      length: [12],
      count: [1],
      includeUppercase: [true],
      includeLowercase: [true],
      includeNumbers: [true],
      includeSpecial: [true]
    });
  }

  generate() {
    this.auth.generatePasswords(this.form.value)
      .subscribe((res: any) => {
        this.passwords = res;
      });
  }

  copy(password: string) {
    navigator.clipboard.writeText(password);
    alert('Copied to clipboard');
  }

  save(password: string) {

    const payload = {
      accountName: 'Generated Account',
      website: '',
      username: '',
      password: password,   // make sure backend expects this name
      category: 'Generated',
      notes: ''
    };

    this.auth.saveGeneratedPassword(payload)
      .subscribe(() => {
        alert('Saved to vault');
      });
  }
}