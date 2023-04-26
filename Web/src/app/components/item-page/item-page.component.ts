import { HttpErrorResponse } from '@angular/common/http';
import { Component, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildInterface } from '../../../models/pokemon/build';
import { CompositionInterface } from '../../../models/pokemon/composition';
import { ItemInterface } from '../../../models/pokemon/item';
import { ItemAPI } from '../../../models/pokemon/item-api';
import { AuthToken } from '../../../services/auth/auth-token';
import { ModalService } from '../../../services/commons/modal';
import { PokemonService } from '../../../services/pokemon/pokemon-service';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent {

  addItemForm: FormGroup;

  isUserLoggedIn: boolean = false;
  isLoading: boolean = false;
  isInitialized: boolean = false;
  cacheData: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  items: ItemAPI[] = [{}];
  p: number = 1;
  itemsPerPage = 12;
  totalItem: any;
  searchTerm = '';
  filteredItems: ItemAPI[] = [];
  itemInfo: ItemAPI = {};

  builds: BuildInterface[] = [];
  compositions: CompositionInterface[] = [];
  filteredBuilds: BuildInterface[] = [];
  filteredCompositions: CompositionInterface[] = [];
  selectedBuild: BuildInterface = {};
  isSearchingBuilds: boolean = false;
  isBuildSelected: boolean = false;

  compositionClicked: number | null = null;
  buildClicked: number | null = null;

  constructor(
    private authToken: AuthToken,
    private pokemonAPI: PokemonAPIService,
    private pokemonService: PokemonService,
    protected modalService: ModalService
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
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

    if (this.pokemonAPI.itemData.getValue().length > 4) {

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

  private uniqBy<T>(a: T[], key: (item: T) => string | number): T[] {
    const seen: { [key: string]: boolean } = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  protected retrieveData() {

    this.isLoading = true;

    this.pokemonAPI.getItems(600, 0, this.cacheData).then((data) => {
      this.items = data;
      this.filteredItems = data;
      this.totalItem = data.length;
    }).catch((error) => {

      this.alertMessage = error.message;
      this.alertError = true;

    });

    setTimeout(() => { this.isLoading = false; }, 1000)

  }

  protected search(): void {

    let itemFilter = this.items;

    if (this.filteredItems.length !== 0) {

      this.filteredItems = [];

    }

    if (parseInt(this.searchTerm)) {

      itemFilter = this.items.filter(item => item.id!.toString().includes(this.searchTerm.toLowerCase()));
      itemFilter.push(...this.items.filter(item => item.cost!.toString().includes(this.searchTerm.toLowerCase())));

    } else {

      itemFilter = this.items.filter(item => item.name!.toLowerCase().includes(this.searchTerm.toLowerCase()));
      itemFilter.push(...this.items.filter(item => item.effect_entries![0].short_effect!.toLowerCase().includes(this.searchTerm.toLowerCase())));
      itemFilter.push(...this.items.filter(item => item.effect_entries![0].effect!.toLowerCase().includes(this.searchTerm.toLowerCase())));
      itemFilter.push(...this.items.filter(item => item.effect_entries!.find(effect => effect.short_effect!.toLowerCase().includes(this.searchTerm.toLowerCase()))));
      itemFilter.push(...this.items.filter(item => item.effect_entries!.find(effect => effect.effect!.toLowerCase().includes(this.searchTerm.toLowerCase()))));

    }

    itemFilter = this.uniqBy(itemFilter, (item) => item.name as string);

    this.filteredItems.splice(0, this.items.length, ...itemFilter);

  }

  protected getItemDetails(index: number): void {

    this.itemInfo = this.items[index];

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

    this.compositionClicked = compositionId;

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

      let buildFilter;

      if (parseInt(this.searchTerm)) {

        buildFilter = this.builds.filter(build => build.Id?.toString().includes(this.searchTerm.toLowerCase()));

      } else {

        buildFilter = this.builds.filter(build => build.Name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
        buildFilter.push(...this.builds.filter(build => build.Description?.toLowerCase().includes(this.searchTerm.toLowerCase())));
        buildFilter.push(...this.builds.filter(build => build.GameVersion?.toLowerCase().includes(this.searchTerm.toLowerCase())));

      }

      buildFilter = this.uniqBy(buildFilter, (item) => item.Name as string);

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
    this.buildClicked = buildId;

  }

  protected resetForms(): void {

    this.selectedBuild = {};
    this.itemInfo = {};
    this.filteredCompositions = [];
    this.isSearchingBuilds = false;
    this.isBuildSelected = false;
    this.compositionClicked = null;
    this.buildClicked = null;

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
