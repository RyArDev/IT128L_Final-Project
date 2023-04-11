import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserRefresh } from "../../models/user/user-refresh";
import { ReloadComponent } from "../commons/reload-component";
import { UserService } from "../user/user-service";

@Injectable({ providedIn: 'root' })
export class AuthToken implements OnInit, OnChanges {

  private accessToken: string = "-1";
  private userId: string = "-1";

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {

    this.accessToken = sessionStorage.getItem('Access-Token')!;
    this.userId = localStorage.getItem('UserId')!;

    if ((this.accessToken !== null && this.accessToken !== undefined) ||
      (this.userId !== null && this.userId !== undefined)) {

      this.isUserLoggedIn.next(true);

    } else {

      this.isUserLoggedIn.next(false);

    }

  }

  ngOnInit(): void {

    this.accessToken = sessionStorage.getItem('Access-Token')!;
    this.userId = localStorage.getItem('UserId')!;

    if ((this.accessToken !== null && this.accessToken !== undefined) ||
      (this.userId !== null && this.userId !== undefined)) {

      this.isUserLoggedIn.next(true);

    } else {

      this.isUserLoggedIn.next(false);

    }

  }

  ngOnChanges(simpleChanges: SimpleChanges): void {

    this.accessToken = sessionStorage.getItem('Access-Token')!;
    this.userId = localStorage.getItem('UserId')!;

    if ((this.accessToken !== null && this.accessToken !== undefined) ||
      (this.userId !== null && this.userId !== undefined)) {

      this.isUserLoggedIn.next(true);

    } else {

      this.isUserLoggedIn.next(false);

    }

  }

  public saveUser(accessToken: string, userId: string, refreshToken: string): void {

    sessionStorage.setItem('Access-Token', accessToken);
    localStorage.setItem('UserId', userId);
    localStorage.setItem('Refresh-Token', refreshToken);

  }

  public removeUser(): void {

    sessionStorage.removeItem('Access-Token');
    localStorage.removeItem('UserId');
    localStorage.removeItem('Refresh-Token');

  }

  public getAccessToken(): string {

    return sessionStorage.getItem('Access-Token')!;

  }

  public getUserId(): number {

    return Number(localStorage.getItem('UserId'));

  }

  public getRefreshToken(): string {

    return localStorage.getItem('Refresh-Token')!;

  }

}
