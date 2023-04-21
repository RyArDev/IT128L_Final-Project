import { Component, SimpleChanges } from '@angular/core';
import { ItemAPI } from '../../../models/pokemon/item-api';
import { AuthToken } from '../../../services/auth/auth-token';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent {

  isUserLoggedIn: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  items: ItemAPI[] = [{}];
  p: number = 1;
  itemsPerPage = 12;
  totalItem: any;
  searchTerm = '';
  filteredItems: ItemAPI[] = [];

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
    this.pokemonAPI.getItems(100, 1).then((data) => {
      this.items = data;
      this.totalItem = data.length;
    }).catch((error) => {

      this.alertMessage = error.message;
      this.alertError = true;

    });
  }


  search(): void {
    const filteredItems = this.items.filter(item => item.name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.items.splice(0, this.items.length, ...filteredItems);

  }
  reset(): void {
    this.searchTerm = '';
    this.filteredItems = this.items;
    this.retrieveData();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

}
