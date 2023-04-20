import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, OnChanges, OnInit, SimpleChanges, ElementRef, AfterViewInit } from '@angular/core';
import { ItemAPI } from '../../../models/pokemon/item-api';
import { PokemonAPI } from '../../../models/pokemon/pokemon-api';
import { AuthToken } from '../../../services/auth/auth-token';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges, AfterViewInit {
  title = 'Home';

  isUserLoggedIn: boolean = false;
  isPokemonLoading: boolean = false;
  isItemsLoading: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  pokemons: PokemonAPI[] = [{}];
  items: ItemAPI[] = [{}];

  @ViewChild('bgVideo') myVideo!: ElementRef;

  constructor(private authToken: AuthToken, private pokemonAPI: PokemonAPIService) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }
 
  ngOnInit(): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.randomizePokemon();
    this.randomizeItems();

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  ngAfterViewInit(): void {

    this.myVideo.nativeElement.load();

  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  randomizePokemon(): void {

    this.isPokemonLoading = true;
    let n = this.getRandomInt(100);

    this.pokemonAPI.getPokemon(3, n).then((data) => {

      this.pokemons = data;

    }).catch((error) => {

      this.alertMessage = error.message;
      this.alertError = true;

    });

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;
    setTimeout(() => { this.isPokemonLoading = false; }, 1000)

  }

  randomizeItems(): void {

    this.isItemsLoading = true;
    let n = this.getRandomInt(100);

    this.pokemonAPI.getItems(3, n).then((data) => {

      this.items = data;

    }).catch((error) => {

      this.alertMessage = error.message;
      this.alertError = true;

    });

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;
    setTimeout(() => { this.isItemsLoading = false; }, 1000)

  }

}
