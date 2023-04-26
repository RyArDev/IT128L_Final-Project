import { HttpErrorResponse } from '@angular/common/http';
import { Component, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildInterface } from '../../../models/pokemon/build';
import { CompositionInterface } from '../../../models/pokemon/composition';
import { PokemonInterface } from '../../../models/pokemon/pokemon';
import { PokemonAPI } from '../../../models/pokemon/pokemon-api';
import { AuthToken } from '../../../services/auth/auth-token';
import { ModalService } from '../../../services/commons/modal';
import { ReloadComponent } from '../../../services/commons/reload-component';
import { PokemonService } from '../../../services/pokemon/pokemon-service';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.css']
})
export class PokemonPageComponent {

  addPokemonForm: FormGroup;

  isUserLoggedIn: boolean = false;
  isLoading: boolean = false;
  isInitialized: boolean = false;
  cacheData: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  pokemons: PokemonAPI[] = [{}];
  p: number = 1;
  itemsPerPage = 12;
  Totalpokemon: any;
  searchTerm = '';
  filteredPokemons: PokemonAPI[] = [];
  pokemonInfo: PokemonAPI = {};

  builds: BuildInterface[] = [];
  compositions: CompositionInterface[] = [];
  filteredBuilds: BuildInterface[] = [];
  filteredCompositions: CompositionInterface[] = [];
  selectedBuild: BuildInterface = {};
  isSearchingBuilds: boolean = false;
  isBuildSelected: boolean = false;

  constructor(
    private authToken: AuthToken,
    private pokemonAPI: PokemonAPIService,
    protected modalService: ModalService,
    private pokemonService: PokemonService
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.addPokemonForm = new FormGroup({
      Id: new FormControl(-1),
      PokeId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      CompositionId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required]),
      Purpose: new FormControl('', [Validators.required, Validators.minLength(10)]),
      ImageURL: new FormControl('', [Validators.required]),
      ApiURL: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;

    });

    this.pokemonService.isProfileInitialized.subscribe(value => {
      this.isInitialized = value;
    });

    if (this.pokemonAPI.pokemonData.getValue().length > 4) {

      this.cacheData = true;

    }

    this.retrieveData();

    if (!this.isUserLoggedIn) {

      return;

    }

    if (!this.isInitialized) {

      this.pokemonService.getBuildByUserId(this.authToken.getUserId()).subscribe({
        next: (response) => {

          this.builds = response.Builds!;

          for (const build of this.builds) {

            this.pokemonService.getCompositionByBuildId(build.Id!).subscribe({
              next: (response) => {

                const compositions = response.Compositions || [];

                for (const composition of compositions) {

                  this.compositions.push(composition);

                }

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

    } else {

      this.pokemonService.builds.subscribe(value => {
        this.builds = value;
      });

      this.pokemonService.compositions.subscribe(value => {
        this.compositions = value;
      });

    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  protected retrieveData() {

    this.isLoading = true;

    this.pokemonAPI.getPokemon(1000, 0, this.cacheData).then((data) => {

      this.pokemons = data;
      this.filteredPokemons = data;
      this.Totalpokemon = data.length;

      if (this.cacheData) {
        this.cacheData = false;
      }

    }).catch((error) => {

      this.alertMessage = error.message;
      this.alertError = true;

    });

    setTimeout(() => { this.isLoading = false; }, 1000)

  }

  protected search(): void {

    let pokemonFilter = this.pokemons;

    if (this.filteredPokemons.length !== 0) {
      this.filteredPokemons = [];
    }

    if (parseInt(this.searchTerm)) {

      pokemonFilter = this.pokemons.filter(pokemon => pokemon.id!.toString().includes(this.searchTerm.toLowerCase()));

    } else {

      pokemonFilter = this.pokemons.filter(pokemon => pokemon.name!.toLowerCase().includes(this.searchTerm.toLowerCase()));

      if (pokemonFilter.length === 0) {

        pokemonFilter = this.pokemons.filter(pokemon => pokemon.types![0].type!.name!.toLowerCase().includes(this.searchTerm.toLowerCase()));
        pokemonFilter.push(...this.pokemons.filter(pokemon => pokemon.types!.find(type => type.type!.name!.toLowerCase().includes(this.searchTerm.toLowerCase()))));

      }

    }

    this.filteredPokemons.splice(0, this.pokemons.length, ...pokemonFilter);

  }

  protected getPokemonDetails(index: number): void {

    this.pokemonInfo = this.pokemons[index];

  }

  protected initializeAddPokemonForm(compositionId: number, currentPokemon: PokemonAPI) {

    this.addPokemonForm = new FormGroup({
      Id: new FormControl(-1),
      PokeId: new FormControl(currentPokemon.id, [Validators.required, Validators.min(1)]),
      CompositionId: new FormControl(compositionId, [Validators.required, Validators.min(1)]),
      Name: new FormControl(currentPokemon.name, [Validators.required]),
      Purpose: new FormControl('None', [Validators.required]),
      ImageURL: new FormControl(currentPokemon.sprites?.front_default, [Validators.required]),
      ApiURL: new FormControl(`https://pokeapi.co/api/v2/pokemon/${currentPokemon.name}`, [Validators.required])
    });

  }

  protected addPokemon = (addPokemonFormValue: any) => {

    if (this.selectedBuild === undefined && this.pokemonInfo === undefined) {

      return;

    }

    const formValues = { ...addPokemonFormValue };

    const pokemon: PokemonInterface = {
      Id: -1,
      PokeId: formValues.PokeId,
      CompositionId: formValues.CompositionId,
      Name: formValues.Name,
      Purpose: formValues.Purpose,
      ImageURL: formValues.ImageURL,
      ApiURL: formValues.ApiURL
    };

    this.pokemonService.addPokemon(pokemon).subscribe({
      next: async (response) => {

        await this.updateCompositionDate(pokemon.CompositionId!);

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => { this.resetForms(); }, 500);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

    this.modalService.close();

  }

  private async updateCompositionDate(compositionId: number): Promise<void> {

    var specificComposition: CompositionInterface = {
      Id: undefined,
      BuildId: undefined,
      Name: undefined,
      Description: undefined,
      DateCreated: undefined,
      DateUpdated: undefined
    };

    this.compositions.forEach((composition) => {

      if (compositionId === composition.Id) {

        specificComposition = composition;
        specificComposition['DateUpdated'] = new Date();

      }

    });

    if (specificComposition.Id !== undefined) {

      await this.pokemonService.updateCompositionByBuildId(specificComposition, specificComposition.Id!, specificComposition.BuildId!).subscribe({
        next: async (response) => {

          await this.updateBuildDate(specificComposition.BuildId!);

        },
        error: (err: HttpErrorResponse) => {

          this.alertMessage = err.message;
          this.alertError = true;

        }

      });

    }

  }

  private async updateBuildDate(buildId: number): Promise<void> {

    var specificBuild: BuildInterface = {
      Id: undefined,
      UserId: undefined,
      Name: undefined,
      GameVersion: undefined,
      Description: undefined,
      DateCreated: undefined,
      DateUpdated: undefined
    };

    specificBuild = this.builds.find(c => c.Id === buildId)!;
    specificBuild['DateUpdated'] = new Date();

    await this.pokemonService.updateBuildByUserId(specificBuild, specificBuild.Id!, specificBuild.UserId!).subscribe({
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }

    });

  }

  protected searchBuilds(): void {

    if (this.filteredBuilds.length !== 0) {

      this.filteredBuilds = [];
      this.isSearchingBuilds = true;
      this.isBuildSelected = false;

    }

    if (this.searchTerm !== '') {

      const buildFilter = this.builds.filter(build => build.Name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.filteredBuilds.splice(0, this.builds.length, ...buildFilter);
      this.isSearchingBuilds = true;

    } else {

      this.isSearchingBuilds = false;
      this.isBuildSelected = false;
      this.selectedBuild = {};

    }

  }

  protected displayCompositionsByBuildId(buildId: number, selectedBuild: BuildInterface): void {

    const compositionFilter = this.compositions.filter(composition => composition.BuildId?.toString().includes(buildId.toString()));
    this.filteredCompositions.splice(0, this.compositions.length, ...compositionFilter);
    this.selectedBuild = selectedBuild;
    this.isBuildSelected = true;

  }

  private resetForms(): void {

    this.selectedBuild = {};
    this.pokemonInfo = {};
    this.filteredCompositions = [];
    this.isSearchingBuilds = false;
    this.isBuildSelected = false;

    this.addPokemonForm = new FormGroup({
      Id: new FormControl(-1),
      PokeId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      CompositionId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required]),
      Purpose: new FormControl('', [Validators.required, Validators.minLength(10)]),
      ImageURL: new FormControl('', [Validators.required]),
      ApiURL: new FormControl('', [Validators.required])
    });

  }

}
