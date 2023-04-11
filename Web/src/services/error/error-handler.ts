import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { UserRefresh } from '../../models/user/user-refresh';
import { AuthToken } from '../auth/auth-token';
import { ReloadComponent } from '../commons/reload-component';
import { UserService } from '../user/user-service';

@Injectable()
export class ErrorHandler implements HttpInterceptor {

  isUserLoggedIn = false;
  userId: number | null = 0;
  refreshToken: string | null = '';

  constructor(private userService: UserService, private authToken: AuthToken, private commonReload: ReloadComponent, private router: Router) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = this.handleError(error);
          return throwError(() => new Error(errorMessage));
        })
      )
  }

  private handleError = (error: HttpErrorResponse): any => {
    if (error.status === 404) {
      //console.log("404");
      return this.handleNotFound(error);
    }
    else if (error.status === 400) {
      //console.log("400");
      return this.handleBadRequest(error);
    }
    else if (error.status === 401) {
      //console.log("401");
      return this.handleUnauthorizedRequest(error);
    }
  }
  private handleNotFound = (error: HttpErrorResponse): string => {
    return error.error.SystemMessage;
  }
  private handleBadRequest = (error: HttpErrorResponse): string => {
    return error.error.SystemMessage;
  }

  private handleUnauthorizedRequest = (error: HttpErrorResponse): string => {

    if (this.isUserLoggedIn) {

      const user: UserRefresh = {
        Id: Number(localStorage.getItem('UserId')!),
        RefreshToken: localStorage.getItem('Refresh-Token')!
      };

      this.userService.refresh(user).subscribe({
        next: (response) => {

          this.authToken.saveUser(response.AccessToken!, response.User!.Id!.toString(), response.User!.RefreshToken!);
          this.authToken.isUserLoggedIn.next(true);
          this.commonReload.reloadComponent(true);

        },
        error: (err: HttpErrorResponse) => {

          this.authToken.isUserLoggedIn.next(false);
          this.router.navigate(['/home']);
          return err.message;

        }
      })

    }

    return "Unauthorized Access. Please login again to continue.";

  }

}
