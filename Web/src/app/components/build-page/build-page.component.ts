import { Component, SimpleChanges } from '@angular/core';
import { AuthToken } from '../../../services/auth/auth-token';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';

@Component({
  selector: 'app-build-page',
  templateUrl: './build-page.component.html',
  styleUrls: ['./build-page.component.css']
})
export class BuildPageComponent {

  isUserLoggedIn: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;

  constructor(private authToken: AuthToken, private pokemonAPI: PokemonAPIService) {

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
