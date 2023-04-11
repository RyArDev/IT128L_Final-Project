import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserRefresh } from '../../../models/user/user-refresh';
import { AuthToken } from '../../../services/auth/auth-token';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnChanges {

  title = 'Navigation Bar';

  isExpanded = false;
  isUserLoggedIn = false;

  constructor(private authToken: AuthToken,
    private userService: UserService,
    private router: Router
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    if (this.isUserLoggedIn) this.retrieveAccessToken();

  }

  ngOnInit(): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    if (this.isUserLoggedIn) this.retrieveAccessToken();

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    if (this.isUserLoggedIn) this.retrieveAccessToken();

  }

  protected logout(): void {
    this.userService.logout();
    this.router.navigate(['/home']);
  }

  protected collapse(): void {
    this.isExpanded = false;
  }

  protected toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  private retrieveAccessToken(): void {

    const user: UserRefresh = {
      Id: Number(localStorage.getItem('UserId')!),
      RefreshToken: localStorage.getItem('Refresh-Token')!
    };

    this.userService.refresh(user).subscribe({
      next: (response) => {

        this.authToken.saveUser(response.AccessToken!, response.User!.Id!.toString(), response.User!.RefreshToken!);

      },
      error: (err: HttpErrorResponse) => {

        console.log(err.message);

      }
    })

  }

}
