import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ================= TOKEN STORAGE =================

  private TOKEN_KEY = 'rev_token';
  private TEMP_USER_KEY = 'rev_temp_user';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setTempUsername(username: string) {
    localStorage.setItem(this.TEMP_USER_KEY, username);
  }

  getTempUsername(): string | null {
    return localStorage.getItem(this.TEMP_USER_KEY);
  }

  clearTempUsername() {
    localStorage.removeItem(this.TEMP_USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================= SECURITY QUESTIONS =================

updateSecurityQuestions(data: any) {
  return this.http.put(
    `${this.api}/api/security-questions`,
    data
  );
}

  // ================= AUTH =================

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  verify2FA(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/verify-2fa`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.api}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearToken();
        this.clearTempUsername();
      })
    );
  }

  // ================= PROFILE =================

  updateProfile(data: any) {
    return this.http.put(`${this.api}/auth/update-profile`, data);
  }

  // ================= 2FA =================

get2FAStatus(): Observable<boolean> {
  return this.http.get<boolean>(`${this.api}/auth/2fa-status`);
}

enable2FA() {
  return this.http.post<string>(`${this.api}/auth/enable-2fa`, {});
}

confirm2FA(code: string) {
  return this.http.post(
    `${this.api}/auth/confirm-2fa?code=${code}`,
    {},
    { responseType: 'text' }
  );
}

disable2FA(code: string) {
  return this.http.post(
    `${this.api}/auth/disable-2fa?code=${code}`,
    {},
    { responseType: 'text' }
  );
}

  // ================= SECURITY ANSWER =================

  verifySecurityAnswer(data: any) {
    return this.http.post(`${this.api}/auth/verify-security-answer`, data);
  }

  resetMasterPassword(data: any) {
    return this.http.put(`${this.api}/auth/reset-master-password`, data);
  }

  // ================= DASHBOARD =================

  getDashboard() {
    return this.http.get(`${this.api}/dashboard`);
  }

  // ================= VAULT =================

  getVault() {
    return this.http.get(`${this.api}/api/vault`);
  }

  searchVault(params: any) {
    return this.http.get(`${this.api}/api/vault/search`, { params });
  }

  addPassword(data: any) {
    return this.http.post(`${this.api}/api/vault`, data);
  }

  updatePassword(id: number, data: any) {
    return this.http.put(
      `${this.api}/api/vault/${id}`,
      data,
      { responseType: 'text' }
    );
  }

  deletePassword(id: number) {
    return this.http.delete(`${this.api}/api/vault/${id}`);
  }

  addToFavorite(id: number) {
    return this.http.put(
      `${this.api}/api/vault/${id}/favorite`,
      {},
      { responseType: 'text' }
    );
  }

  removeFromFavorite(id: number) {
    return this.http.delete(
      `${this.api}/api/vault/${id}/favorite`,
      { responseType: 'text' }
    );
  }

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/api/vault/favorites`);
  }

  viewPassword(id: number, masterPassword: string) {
    return this.http.post(
      `${this.api}/api/vault/${id}/view`,
      { masterPassword }
    );
  }

  securityAudit(masterPassword: string) {
    return this.http.post(
      `${this.api}/api/vault/audit`,
      { masterPassword }
    );
  }

  getSecurityAlerts(masterPassword: string) {
    return this.http.post(
      `${this.api}/api/security/alerts`,
      { masterPassword }
    );
  }

  // ================= GENERATOR =================

  generatePasswords(data: any) {
    return this.http.post(`${this.api}/api/generator`, data);
  }

  checkPasswordStrength(password: string) {
    return this.http.post(
      `${this.api}/api/generator/strength`,
      { password }
    );
  }

  saveGeneratedPassword(data: any) {
    return this.http.post(`${this.api}/api/vault/save-generated`, data);
  }

  // ================= BACKUP =================

  exportBackup(masterPassword: string) {
    return this.http.post(
      `${this.api}/api/backup/export`,
      { masterPassword },
      { responseType: 'text' }
    );
  }

  importBackup(data: any) {
    return this.http.post(`${this.api}/api/backup/import`, data);
  }

  // ================= SECURITY QUESTIONS =================

  getQuestions() {
    return this.http.get(`${this.api}/api/security-questions`);
  }
}
