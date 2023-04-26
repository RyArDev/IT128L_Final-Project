import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import PROXY_CONFIG from '../../config/proxy.conf';

@Injectable({ providedIn: 'root' })
export class PokemonAPIService {

  pokemons: Object[] = [];
  items: Object[] = [];

  pokemonData: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  itemData: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);

  constructor(private http: HttpClient) { }

  public getPokemon = async (quantity: number, offSet: number, cacheData: boolean): Promise<Object[]> => {

    if (cacheData) {

      return this.pokemons;

    }

    this.pokemonData.next([])
    this.pokemons = [];

    try {

      if (quantity < 0 || !Number(quantity)) {

        quantity = 1;

      }

      if (offSet < 0 || !Number(offSet)) {

        offSet = 0;

      }

      await this.http.get<any>(`${PROXY_CONFIG.pokeAPI}/pokemon/?limit=${quantity}&offset=${offSet}`).subscribe(
        (response) => {

          const data: any[] = response['results'];

          data.forEach(async (pokemon) => {

            await this.http.get<any>(pokemon.url).pipe(tap(p => this.pokemonData.next([...this.pokemonData.getValue(), p]))).subscribe(
              (retrievedPokemon) => {

                this.pokemons.push(retrievedPokemon);
                
              }
            )

          });

        });

    } catch (error: unknown) {

      if (error instanceof Error) {

        throw error.message;

      }

    }

    return this.pokemons;

  }

  public getPokemonByIdName = (idName: string): Observable<Object> => {

    let pokemon: any = {};

    try {

      if (parseInt(idName)) {

        const n = parseInt(idName);

        return this.http.get(`${PROXY_CONFIG.pokeAPI}/pokemon/${n}`).pipe(
          map((response: any) => {

            pokemon = response;
            return pokemon;

          })

        );

      } else {

        idName = idName.toLowerCase();

        return this.http.get(`${PROXY_CONFIG.pokeAPI}/pokemon/${idName}`).pipe(
          map((response: any) => {

            pokemon = response;
            return pokemon;

          })

        );

      }

    } catch (error: unknown) {

      if (error instanceof Error) {

        throw error.message;

      }

    }

    return of(pokemon);

  }

  public getItems = async (quantity: number, offSet: number, cacheData: boolean): Promise<Object[]> => {

    if (cacheData) {

      return this.items;

    }

    this.itemData.next([])
    this.items = [];

    try {

      if (quantity < 0 || !Number(quantity)) {

        quantity = 1;

      }

      if (offSet < 0 || !Number(offSet)) {

        offSet = 0;

      }

      await this.http.get<any>(`${PROXY_CONFIG.pokeAPI}/item/?limit=${quantity}&offset=${offSet}`).subscribe(
        (response) => {

          const data: any[] = response['results'];

          data.forEach(async (item) => {

            await this.http.get<any>(item.url).pipe(tap(i => this.itemData.next([...this.itemData.getValue(), i]))).subscribe(
              (retrievedItem) => {

                this.items.push(retrievedItem);

              });

          });

        });

    } catch (error: unknown) {

      if (error instanceof Error) {

        throw error.message;

      }

    }

    return this.items;

  }

  public getItemByIdName = (idName: string): Observable<Object> => {

    let item: any = {};

    try {

      if (parseInt(idName)) {

        const n = parseInt(idName);

        return this.http.get(`${PROXY_CONFIG.pokeAPI}/item/${n}`).pipe(
          map((response: any) => {

            item = response;
            return item;

          })

        );

      } else {

        idName = idName.toLowerCase();

        return this.http.get(`${PROXY_CONFIG.pokeAPI}/item/${idName}`).pipe(
          map((response: any) => {

            item = response;
            return item;

          })

        );

      }

    } catch (error: unknown) {

      if (error instanceof Error) {

        throw error.message;

      }

    }

    return of(item);

  }

}
