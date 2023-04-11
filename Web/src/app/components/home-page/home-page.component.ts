import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthToken } from '../../../services/auth/auth-token';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges {
  title = 'Home';

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
