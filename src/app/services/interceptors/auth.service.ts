import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/User.model';
import { AuthResponse } from 'src/app/models/response-models/auth.response.model';
import { Token } from 'src/app/models/Token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authSubject = new BehaviorSubject<AuthResponse>(null);
  authData: AuthResponse;
  refreshTimeout;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  async login(email: string, password: string) {
    let authData = await this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password }).toPromise();
    this.processSuccessfullAuth(authData);
    this.router.navigate(['/'])
  }

  async register(user: { email: string, password: string, firstName: string, lastName: string, role: 'owner' | 'customer' }) {
    let authData = await this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, user).toPromise();
    this.processSuccessfullAuth(authData);
    this.router.navigate(['/'])
  }

  async forgotPassword(email: string) {
    await this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/forgot-password`, { email }).toPromise();
  }

  async resetPassword(password: string, token: string) {
    let options = {
      params: { token }
    }
    await this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/reset-password`, { password }, options).toPromise();
  }


  /**
   * Attempts to retrieve and save new access token and user data using existing saved refresh_token. 
   * Will return authData if success.
   */
  async autoAuthUsingRefreshToken(): Promise<AuthResponse> {
    if (!this.isRefreshTokenAvailableAndValid()) {
      return;
    }

    let { token } = this.getSavedTokenData('refresh');

    let authData;
    try {
      authData = await this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/refresh-tokens`, { refreshToken: token }).toPromise();
    }
    catch (err) {
      return;
    }
    this.processSuccessfullAuth(authData);
    return authData;
  }



  /**
   * saves both tokens in local storage. Signals successful auth to all subs. 
   * Resets refresh-auth timer to new expiration date minus 1 minute.
   * @param authData user and tokens
   */
  private processSuccessfullAuth(authData: AuthResponse) {
    this.authData = authData;
    this.saveTokenData(authData.tokens.access.token, authData.tokens.access.expires, 'access');
    this.saveTokenData(authData.tokens.refresh.token, authData.tokens.refresh.expires, 'refresh');
    this.authSubject.next(authData); // must come after saving tokens
    this.restartRefreshAuthTimer();
  }

  private restartRefreshAuthTimer() {
    let { expires } = this.getSavedTokenData('access');
    let msTillExpiration: number = new Date(expires).valueOf() - new Date().valueOf() - 60 * 1000;
    clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(this.autoAuthUsingRefreshToken.bind(this), msTillExpiration);
  }

  logout() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('access-token-expiration');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('refresh-token-expiration');
    this.authData = null;
    this.authSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAuthDataObservable() {
    return this.authSubject.asObservable();
  }

  getUser(): User {
    return this.authData && { ...this.authData.user };
  }

  getUserOrThrow(): User {
    if (!this.authData) throw new Error('User data not found!');
    return this.getUser();
  }

  getAccessToken(): Token {
    return this.authData && this.authData.tokens && this.authData.tokens.access;
  }

  getRefreshToken(): Token {
    return this.authData && this.authData.tokens && this.authData.tokens.refresh;
  }

  saveTokenData(token: string, expires: string, type: 'access' | 'refresh') {
    localStorage.setItem(`${type}-token`, token);
    localStorage.setItem(`${type}-token-expiration`, expires);
  }

  getSavedTokenData(type: 'access' | 'refresh'): Token {
    return {
      token: localStorage.getItem(`${type}-token`),
      expires: localStorage.getItem(`${type}-token-expiration`),
    }
  }

  isRefreshTokenAvailableAndValid(): boolean {
    let { expires, token } = this.getSavedTokenData('refresh');
    return (expires && token && (new Date(expires) > new Date()));
  }
}
