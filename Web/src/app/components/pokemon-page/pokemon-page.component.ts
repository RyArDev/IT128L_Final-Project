import { Component, SimpleChanges } from '@angular/core';
import { PokemonAPI } from '../../../models/pokemon/pokemon-api';
import { AuthToken } from '../../../services/auth/auth-token';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.css']
})
export class PokemonPageComponent {

  isUserLoggedIn: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  pokemons: PokemonAPI[] = [{}];
  p: number = 1;
  itemsPerPage = 12;
  Totalpokemon: any;
  searchTerm = '';
  filteredPokemons: PokemonAPI[] = [];

  constructor(private authToken: AuthToken, private pokemonAPI: PokemonAPIService) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  ngOnInit(): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;

    });
    this.retrieveData();


  }
  retrieveData() {

    this.pokemonAPI.getPokemon(100, 3).then((data) => {

      this.pokemons = data;
      this.Totalpokemon = data.length;
    }).catch((error) => {

      this.alertMessage = error.message;
      this.alertError = true;

    });
  }
  search(): void {

    const filteredPokemons = this.pokemons.filter(pokemon => pokemon.name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.pokemons.splice(0, this.pokemons.length, ...filteredPokemons);

  }
  reset(): void {
    this.searchTerm = '';
    this.filteredPokemons = this.pokemons;
    this.retrieveData();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

}
