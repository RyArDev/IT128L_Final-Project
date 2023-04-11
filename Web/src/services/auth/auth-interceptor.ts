import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import PROXY_CONFIG from '../../config/proxy.conf';
import { UserRefresh } from '../../models/user/user-refresh';
import { UserService } from '../user/user-service';
import { AuthToken } from './auth-token';

@Injectable()
export class AuthInterceptor implements OnInit, OnChanges {

  isUserLoggedIn: boolean = false;

  constructor(
    private authToken: AuthToken
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  ngOnInit(): void {
    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isApiUrl = request.url.startsWith(PROXY_CONFIG.target);

    if (this.isUserLoggedIn && isApiUrl) {

      request = request.clone({
        setHeaders: { Authorization: `Bearer ${this.authToken.getAccessToken()}` }
      });

    }

    return next.handle(request);
  }
}
