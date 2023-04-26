import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import PROXY_CONFIG from '../../config/proxy.conf';
import { HttpResponse } from '../../models/http/http-response';
import { BuildInterface } from '../../models/pokemon/build';
import { CompositionInterface } from '../../models/pokemon/composition';
import { ItemInterface } from '../../models/pokemon/item';
import { PokemonInterface } from '../../models/pokemon/pokemon';

@Injectable({ providedIn: 'root' })
export class PokemonService {

  public isProfileInitialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public builds: BehaviorSubject<BuildInterface[]> = new BehaviorSubject<BuildInterface[]>([{}]);
  public compositions: BehaviorSubject<CompositionInterface[]> = new BehaviorSubject<CompositionInterface[]>([{}]);
  public pokemon: BehaviorSubject<PokemonInterface[]> = new BehaviorSubject<PokemonInterface[]>([{}]);
  public items: BehaviorSubject<ItemInterface[]> = new BehaviorSubject<ItemInterface[]>([{}]);

  constructor(private http: HttpClient) { }

  //Build

  public addBuild(build: BuildInterface) {
    return this.http.post<HttpResponse>(`${PROXY_CONFIG.target}/build/add`, build);
  }

  public getBuildByUserId(userId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/build/user/${userId}`);
  }

  public getBuildById(buildId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/build/${buildId}`);
  }

  public updateBuildByUserId(build: BuildInterface, buildId: number, userId: number) {
    return this.http.put<HttpResponse>(`${PROXY_CONFIG.target}/build/update/${buildId}/user/${userId}`, build);
  }

  public deleteBuildByUserId(buildId: number, userId: number) {
    return this.http.delete<HttpResponse>(`${PROXY_CONFIG.target}/build/delete/${buildId}/user/${userId}`);
  }

  //Composition

  public addComposition(composition: CompositionInterface) {
    return this.http.post<HttpResponse>(`${PROXY_CONFIG.target}/composition/add`, composition);
  }

  public getCompositionByBuildId(buildId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/composition/build/${buildId}`);
  }

  public getCompositionById(compositionId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/composition/${compositionId}`);
  }

  public updateCompositionByBuildId(composition: CompositionInterface, compositionId: number, buildId: number) {
    return this.http.put<HttpResponse>(`${PROXY_CONFIG.target}/composition/update/${compositionId}/build/${buildId}`, composition);
  }

  public deleteCompositionByBuildId(compositionId: number, buildId: number) {
    return this.http.delete<HttpResponse>(`${PROXY_CONFIG.target}/composition/delete/${compositionId}/build/${buildId}`);
  }

  //Pokemon

  public addPokemon(pokemon: PokemonInterface) {
    return this.http.post<HttpResponse>(`${PROXY_CONFIG.target}/pokemon/add`, pokemon);
  }

  public getPokemonByCompositionId(compositionId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/pokemon/composition/${compositionId}`);
  }

  public getPokemonById(pokemonId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/pokemon/${pokemonId}`);
  }

  public updatePokemonByCompositionId(pokemon: PokemonInterface, pokemonId: number, compositionId: number) {
    return this.http.put<HttpResponse>(`${PROXY_CONFIG.target}/pokemon/update/${pokemonId}/composition/${compositionId}`, pokemon);
  }

  public deletePokemonByCompositionId(pokemonId: number, compositionId: number) {
    return this.http.delete<HttpResponse>(`${PROXY_CONFIG.target}/pokemon/delete/${pokemonId}/composition/${compositionId}`);
  }

  //Items

  public addItem(item: ItemInterface) {
    return this.http.post<HttpResponse>(`${PROXY_CONFIG.target}/item/add`, item);
  }

  public getItemsByCompositionId(compositionId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/item/composition/${compositionId}`);
  }

  public getItemById(itemId: number) {
    return this.http.get<HttpResponse>(`${PROXY_CONFIG.target}/item/${itemId}`);
  }

  public updateItemByCompositionId(item: ItemInterface, itemId: number, compositionId: number) {
    return this.http.put<HttpResponse>(`${PROXY_CONFIG.target}/item/update/${itemId}/composition/${compositionId}`, item);
  }

  public deleteItemByCompositionId(itemId: number, compositionId: number) {
    return this.http.delete<HttpResponse>(`${PROXY_CONFIG.target}/item/delete/${itemId}/composition/${compositionId}`);
  }

}
