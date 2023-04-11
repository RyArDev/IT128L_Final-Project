import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthToken } from '../../../services/auth/auth-token';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit, OnChanges {
  title = '404 Not Found';

  isUserLoggedIn: boolean = false;

  constructor(private authToken: AuthToken) {

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
}
