import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, OnChanges, OnInit, SimpleChanges, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildInterface } from '../../../models/pokemon/build';
import { CompositionInterface } from '../../../models/pokemon/composition';
import { ItemInterface } from '../../../models/pokemon/item';
import { ItemAPI } from '../../../models/pokemon/item-api';
import { PokemonInterface } from '../../../models/pokemon/pokemon';
import { PokemonAPI } from '../../../models/pokemon/pokemon-api';
import { AuthToken } from '../../../services/auth/auth-token';
import { DateService } from '../../../services/commons/date';
import { ModalService } from '../../../services/commons/modal';
import { ReloadComponent } from '../../../services/commons/reload-component';
import { PokemonService } from '../../../services/pokemon/pokemon-service';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges, AfterViewInit {
  title = 'Home';

  addPokemonForm: FormGroup;
  addItemForm: FormGroup;

  isUserLoggedIn: boolean = false;
  isPokemonLoading: boolean = false;
  isItemsLoading: boolean = false;
  isInitialized: boolean = false;
  cachePokemonData: boolean = false;
  cacheItemData: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  pokemons: PokemonAPI[] = [{}];
  items: ItemAPI[] = [{}];
  pokemonInfo: PokemonAPI = {};
  itemInfo: ItemAPI = {};

  searchTerm: string = "";
  builds: BuildInterface[] = [];
  compositions: CompositionInterface[] = [];
  filteredBuilds: BuildInterface[] = [];
  filteredCompositions: CompositionInterface[] = [];
  selectedBuild: BuildInterface = {};
  isSearchingBuilds: boolean = false;
  isBuildSelected: boolean = false;

  @ViewChild('bgVideo') myVideo!: ElementRef;

  constructor(
    private authToken: AuthToken,
    private pokemonAPI: PokemonAPIService,
    private pokemonService: PokemonService,
    protected modalService: ModalService
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

    this.addItemForm = new FormGroup({
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

    if (this.pokemonAPI.pokemonData.getValue().length > 3) {

      this.cachePokemonData = true;

    }

    if (this.pokemonAPI.itemData.getValue().length > 3) {

      this.cacheItemData = true;

    }

    this.randomizePokemon();
    this.randomizeItems();

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

  ngAfterViewInit(): void {

    this.myVideo.nativeElement.load();

  }

  private getRandomInt(randomNumber: number): number {

    return Math.floor(Math.random() * (randomNumber + 1));

  }

  protected randomizePokemon(): void {

    this.pokemons = [];
    this.isPokemonLoading = true;
    const n = this.getRandomInt(1000);

    if (this.cachePokemonData && this.pokemonAPI.pokemonData.value) {

      while (this.pokemons.length < 3) {
        const index = Math.floor(Math.random() * this.pokemonAPI.pokemonData.value.length);
        const object = this.pokemonAPI.pokemonData.value[index];
        if (!this.pokemons.includes(object)) {
          this.pokemons.push(object);
        }
      }

    } else {

      this.pokemonAPI.getPokemon(3, n, this.cachePokemonData).then((data) => {

        this.pokemons = data;

      }).catch((error) => {

        this.alertMessage = error.message;
        this.alertError = true;

      });

    }

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;
    setTimeout(() => { this.isPokemonLoading = false; }, 1000);

  }

  protected randomizeItems(): void {

    this.items = [];
    this.isItemsLoading = true;
    const n = this.getRandomInt(600);

    if (this.cacheItemData && this.pokemonAPI.itemData.value) {

      while (this.items.length < 3) {
        const index = Math.floor(Math.random() * this.pokemonAPI.itemData.value.length);
        const object = this.pokemonAPI.itemData.value[index];
        if (!this.items.includes(object)) {
          this.items.push(object);
        }
      }

    } else {

      this.pokemonAPI.getItems(3, n, this.cacheItemData).then((data) => {

        this.items = data;

      }).catch((error) => {

        this.alertMessage = error.message;
        this.alertError = true;

      });

    }

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;
    setTimeout(() => { this.isItemsLoading = false; }, 1000);

  }

  protected getPokemonDetails(index: number): void {

    this.pokemonInfo = this.pokemons[index];

  }

  protected getItemDetails(index: number): void {

    this.itemInfo = this.items[index];

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

  protected initializeAddItemForm(compositionId: number, currentItem: ItemAPI) {

    this.addItemForm = new FormGroup({
      Id: new FormControl(-1),
      PokeId: new FormControl(currentItem.id, [Validators.required, Validators.min(1)]),
      CompositionId: new FormControl(compositionId, [Validators.required, Validators.min(1)]),
      Name: new FormControl(currentItem.name, [Validators.required]),
      Purpose: new FormControl('None', [Validators.required]),
      ImageURL: new FormControl(currentItem.sprites?.default, [Validators.required]),
      ApiURL: new FormControl(`https://pokeapi.co/api/v2/item/${currentItem.name}`, [Validators.required])
    });

  }

  protected addItem = (addItemFormValue: any) => {

    if (this.selectedBuild === undefined && this.itemInfo === undefined) {

      return;

    }

    const formValues = { ...addItemFormValue };

    const item: ItemInterface = {
      Id: -1,
      PokeId: formValues.PokeId,
      CompositionId: formValues.CompositionId,
      Name: formValues.Name,
      Purpose: formValues.Purpose,
      ImageURL: formValues.ImageURL,
      ApiURL: formValues.ApiURL
    };

    this.pokemonService.addItem(item).subscribe({
      next: async (response) => {

        await this.updateCompositionDate(item.CompositionId!);

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
    this.itemInfo = {};
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

    this.addItemForm = new FormGroup({
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
