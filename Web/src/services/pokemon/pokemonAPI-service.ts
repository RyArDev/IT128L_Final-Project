import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PROXY_CONFIG from '../../config/proxy.conf';

@Injectable({ providedIn: 'root' })
export class PokemonAPIService {
  
  pokemons: Object[] = [];
  pokemon: Object = {};
  items: Object[] = [];
  item: Object = {};

  constructor(private http: HttpClient) { }

  public getPokemon = async (quantity: number, offSet: number): Promise<Object[]> => {

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

            await this.http.get<any>(pokemon.url).subscribe(
              (response) => {

                this.pokemons.push(response);

              });

          });

        });

    } catch (error: unknown) {

      if (error instanceof Error) {

        throw error.message;

      }

    }

    return this.pokemons;

  }

  public getPokemonByIdName = async (idName: string): Promise<Object> => {

    this.pokemon = {};

    try {

      if (Number(idName)) {

        this.pokemon = this.http.get<any>(`${PROXY_CONFIG.pokeAPI}/pokemon/${parseInt(idName)}`);

      } else {

        this.pokemon = this.http.get<any>(`${PROXY_CONFIG.pokeAPI}/pokemon/${idName}`);

      }

    } catch (error: unknown) {

      if (error instanceof Error) {

        throw error.message;

      }

    }

    return this.pokemon;

  }

  public getItems = async (quantity: number, offSet: number): Promise<Object[]> => {

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

            await this.http.get<any>(item.url).subscribe(
              (response) => {

                this.items.push(response);

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

  public getItemByIdName = async (idName: string): Promise<Object> => {

    this.item = {};

    try {

      if (Number(idName)) {

        this.item = this.http.get<any>(`${PROXY_CONFIG.pokeAPI}/item/${parseInt(idName)}`);

      } else {

        this.item = this.http.get<any>(`${PROXY_CONFIG.pokeAPI}/item/${idName}`);

      }

    } catch (error: unknown) {

      if (error instanceof Error) {

        throw error.message;

      }

    }

    return this.item;

  }

}
