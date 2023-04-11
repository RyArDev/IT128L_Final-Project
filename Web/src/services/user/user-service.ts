import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PROXY_CONFIG from '../../config/proxy.conf';
import { AuthToken } from '../auth/auth-token';
import { User } from '../../models/user/user';
import { HttpResponse } from '../../models/http/http-response';
import { UserLogin } from '../../models/user/user-login';
import { UserRegistration } from '../../models/user/user-registration';
import { UserRefresh } from '../../models/user/user-refresh';
import { UserUpdate } from '../../models/user/user-update';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient, private authToken: AuthToken) { }

  public register(user: UserRegistration) {
    return this.http.post<HttpResponse>(`${PROXY_CONFIG.target}/user/register`, user);
  }

  public login(user: UserLogin) {
    return this.http.post<HttpResponse>(`${PROXY_CONFIG.target}/user/login`, user);
  }

  public getAll() {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/user/all`);
  }

  public getById(userId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/user/${userId}`);
  }

  public refresh(user: UserRefresh) {
    return this.http.post<HttpResponse>(`${PROXY_CONFIG.target}/user/refresh`, user);
  }

  public update(user: UserUpdate) {
    return this.http.put<HttpResponse>(`${PROXY_CONFIG.target}/user/update`, user);
  }

  public logout(): void {

    this.authToken.removeUser();
    this.authToken.isUserLoggedIn.next(false);

  }

}
