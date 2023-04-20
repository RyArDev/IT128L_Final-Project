import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogin } from '../../../models/user/user-login';
import { AuthToken } from '../../../services/auth/auth-token';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnChanges {

  title = 'User Login';

  loginForm: FormGroup;
  isUserLoggedIn: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;

  constructor(private router: Router,
    private userService: UserService,
    private authToken: AuthToken
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.loginForm = new FormGroup({
      UserName: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
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

  public validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)!.invalid && this.loginForm.get(controlName)!.touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)!.hasError(errorName)
  }

  public loginUser = async (loginFormValue: any) => {

    const formValues = { ...loginFormValue };

    const userLogin: UserLogin = {
      UserName: formValues.UserName,
      Password: formValues.Password
    };

    if (!this.isUserLoggedIn) {

      this.userService.login(userLogin)
        .subscribe({
          next: (response) => {

            this.authToken.saveUser(response.AccessToken!, response.User!.Id!.toString(), response.User!.RefreshToken!);
            this.authToken.isUserLoggedIn.next(true);

            this.alertMessage = response.SystemMessage + " Redirecting...";
            this.alertSuccess = true;

            this.authToken.isUserLoggedIn.next(true);

            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 3000);

          },
          error: (err: HttpErrorResponse) => {

            this.alertMessage = err.message;
            this.alertError = true;

          }
        })

    } else {

      this.alertMessage = "User already logged in.";
      this.alertError = true;

    }

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

}
