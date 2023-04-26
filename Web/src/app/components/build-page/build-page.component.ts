import { HttpErrorResponse } from '@angular/common/http';
import { Component, SimpleChanges } from '@angular/core';
import { BuildInterface } from '../../../models/pokemon/build';
import { CompositionInterface } from '../../../models/pokemon/composition';
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user-service';
import { AuthToken } from '../../../services/auth/auth-token';
import { DateService } from '../../../services/commons/date';
import { ModalService } from '../../../services/commons/modal';
import { PokemonService } from '../../../services/pokemon/pokemon-service';
import { PokemonInterface } from '../../../models/pokemon/pokemon';
import { ItemInterface } from '../../../models/pokemon/item';
import { PokemonAPI } from '../../../models/pokemon/pokemon-api';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';
import { ItemAPI } from '../../../models/pokemon/item-api';

@Component({
  selector: 'app-build-page',
  templateUrl: './build-page.component.html',
  styleUrls: ['./build-page.component.css']
})
export class BuildPageComponent {

  isUserLoggedIn: boolean = false;
  isLoading: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  searchTerm: string = '';

  p: number = 1;
  itemsPerPage: number = 6;
  totalBuilds: any;

  users: User[] = [];
  builds: BuildInterface[] = [];
  compositions: CompositionInterface[] = [];

  filteredUsers: User[] = [];
  filteredBuilds: BuildInterface[] = [];
  filteredCompositions: CompositionInterface[] = [];

  selectedUser: User = {};
  selectedBuild: BuildInterface = {};
  selectedComposition: CompositionInterface = {};
  selectedPokemons: PokemonInterface[] = [];
  selectedItems: ItemInterface[] = [];
  pokemon: PokemonInterface = {};
  item: ItemInterface = {};

  currentViewPokemon: PokemonAPI = {};
  currentViewItem: ItemAPI = {};

  isBuildSelected: boolean = false;
  isCompositionSelected: boolean = false;
  buildClicked: number | null = null;
  compositionClicked: number | null = null;

  constructor(
    private authToken: AuthToken,
    private pokemonService: PokemonService,
    private userService: UserService,
    private pokemonAPI: PokemonAPIService,
    protected modalService: ModalService,
    protected dateService: DateService
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.modalService.close();

  }

  ngOnInit(): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.userService.getAll().subscribe({
      next: (response) => {

        this.users = response.Users!;

        this.pokemonService.getAllBuilds().subscribe({
          next: (response) => {

            this.builds = response.Builds!;

            for (const build of this.builds) {

              build.DateCreated = this.dateService.transformToLocaleDate(build.DateCreated!);
              build.DateUpdated = this.dateService.transformToLocaleDate(build.DateUpdated!);

              this.pokemonService.getAllCompositions().subscribe({
                next: (response) => {

                  const compositions = response.Compositions || [];

                  for (const composition of compositions) {

                    composition.DateCreated = this.dateService.transformToLocaleDate(composition.DateCreated!);
                    composition.DateUpdated = this.dateService.transformToLocaleDate(composition.DateUpdated!);

                  }

                  this.compositions = compositions;

                  this.filteredUsers = this.users;
                  this.filteredBuilds = this.builds;
                  this.filteredCompositions = this.compositions;

                },
                error: (err: HttpErrorResponse) => {

                  this.alertMessage = err.message;
                  this.alertError = true;

                }

              });

            }

          },
          error: (err: HttpErrorResponse) => {

            this.alertMessage = err.message;
            this.alertError = true;

          }

        });

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    });

  } 

  ngOnChanges(changes: SimpleChanges): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  private uniqBy<T>(a: T[], key: (item: T) => string | number): T[] {
    const seen: { [key: string]: boolean } = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  protected searchBuilds(): void {

    let buildFilter = this.builds;

    if (this.filteredBuilds.length !== 0) {

      this.filteredBuilds = [];

    }

    const searchTerm = this.searchTerm.toLowerCase();

    if (parseInt(searchTerm)) {

      buildFilter = buildFilter.filter(build => build.Id?.toString().includes(searchTerm));
      buildFilter.push(...this.builds.filter(build => build.UserId?.toString().includes(searchTerm)));
      buildFilter.push(...this.builds.filter(build => {
        const user = this.users.find(u => u.Id === build.UserId);
        return user && user.UserName!.toLowerCase().includes(searchTerm);
      }));

    } else {

      buildFilter = buildFilter.filter(build =>
        build.Name?.toLowerCase().includes(searchTerm) ||
        build.Description?.toLowerCase().includes(searchTerm) ||
        build.GameVersion?.toLowerCase().includes(searchTerm)
      );

      const users = this.users.map(user => ({ id: user.Id, name: user.UserName }));

      buildFilter.push(...this.builds.filter(build => {
        const user = users.find(u => u.id === build.UserId);
        return user && user.name!.toLowerCase().includes(this.searchTerm.toLowerCase());
      }));

    }

    buildFilter = this.uniqBy(buildFilter, (item) => item.Name as string);

    this.filteredBuilds.splice(0, this.builds.length, ...buildFilter);

  }

  protected displayCompositionsByBuildId(buildId: number, selectedBuild: BuildInterface): void {

    this.filteredCompositions = [];
    const compositionFilter = this.compositions.filter(composition => composition.BuildId?.toString().includes(buildId.toString()));
    this.filteredCompositions.splice(0, this.compositions.length, ...compositionFilter);
    this.isBuildSelected = true;
    this.isCompositionSelected = false;
    this.selectedBuild = selectedBuild;
    this.selectedUser = this.users.find(u => u.Id === selectedBuild.UserId)!;
    this.buildClicked = buildId;

  }

  protected getCompositionDetails(compositionId: number): void {

    this.selectedPokemons = [];
    this.selectedItems = [];
    this.selectedComposition = this.compositions.find(c => c.Id === compositionId)!;
    this.compositionClicked = compositionId;
    this.isCompositionSelected = true;

    this.pokemonService.getAllPokemon().subscribe({
      next: (response) => {

        this.selectedPokemons.push(...response.Pokemons!.filter(pokemon => pokemon.CompositionId === compositionId));

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }

    });

    this.pokemonService.getAllItems().subscribe({
      next: (response) => {

        this.selectedItems.push(...response.Items!.filter(item => item.CompositionId === compositionId));

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }

    });

  }

  protected async viewPokemon(pokemonName: string, Id: number): Promise<void> {

    await this.pokemonAPI.getPokemonByIdName(pokemonName).subscribe((response) => {

      this.currentViewPokemon = response;

    });

    this.pokemon = await this.selectedPokemons.find(pokemon => pokemon.Id === Id)!;

    this.modalService.open('view-pokemon');

  }

  protected async viewItem(itemName: string, Id: number): Promise<void> {

    await this.pokemonAPI.getItemByIdName(itemName).subscribe((response) => {

      this.currentViewItem = response;

    });

    this.item = await this.selectedItems.find(item => item.Id === Id)!;

    this.modalService.open('view-item');

  }

}
