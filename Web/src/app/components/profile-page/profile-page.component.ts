import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { BuildInterface } from '../../../models/pokemon/build';
import { CompositionInterface } from '../../../models/pokemon/composition';
import { ItemInterface } from '../../../models/pokemon/item';
import { ItemAPI } from '../../../models/pokemon/item-api';
import { PokemonInterface } from '../../../models/pokemon/pokemon';
import { PokemonAPI } from '../../../models/pokemon/pokemon-api';
import { User } from '../../../models/user/user';
import { UserUpdate } from '../../../models/user/user-update';
import { AuthToken } from '../../../services/auth/auth-token';
import { DateService } from '../../../services/commons/date';
import { ModalService } from '../../../services/commons/modal';
import { PasswordConfirmationValidator } from '../../../services/commons/password-confirmation-validator';
import { ReloadComponent } from '../../../services/commons/reload-component';
import { ImageUpload } from '../../../services/file-upload/image-upload';
import { PokemonService } from '../../../services/pokemon/pokemon-service';
import { PokemonAPIService } from '../../../services/pokemon/pokemonAPI-service';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnChanges{

  title = "User Profile"

  updateUserForm: FormGroup;
  addBuildForm: FormGroup;
  updateBuildForm: FormGroup;
  addCompositionForm: FormGroup;
  updateCompositionForm: FormGroup;
  addPokemonForm: FormGroup;
  updatePokemonForm: FormGroup;
  addItemForm: FormGroup;
  updateItemForm: FormGroup;

  isUserLoggedIn: boolean = false;
  isInitialized: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;

  user: User = {
    Id: -1,
    UserName: "N/A",
    FirstName: "N/A",
    LastName: "N/A",
    Email: "N/A",
    ProfilePicName: "N/A",
    ProfilePicUrl: "../../assets/components/profile-page/Default_Profile_Picture.jpg",
    RefreshToken: "N/A"
  };

  builds: BuildInterface[] = [/*{
    Id: -1,
    UserId: -1,
    Name: "N/A",
    GameVersion: "N/A",
    Description: "N/A",
    DateCreated: undefined,
    DateUpdated: undefined,
  }*/]

  latestBuild: BuildInterface = {
    Id: -1,
    Name: "N/A",
    GameVersion: "N/A",
    Description: "N/A",
    DateCreated: undefined,
    DateUpdated: undefined
  }

  compositions: CompositionInterface[] = [/*{
    Id: -1,
    BuildId: -1,
    Name: "N/A",
    Description: "N/A",
    DateCreated: undefined,
    DateUpdated: undefined
  }*/]

  currentComposition: CompositionInterface = {
    Id: -1,
    BuildId: -1,
    Name: "N/A",
    Description: "N/A",
    DateCreated: undefined,
    DateUpdated: undefined
  }

  pokemon: PokemonInterface = {
    Id: -1,
    PokeId: -1,
    CompositionId: -1,
    Name: "N/A",
    Purpose: "N/A",
    ImageURL: "../../../assets/pokemon/mystery.jpg",
    ApiURL: "N/A"
  }

  pokemons: PokemonInterface[] = [/*{
    Id: -1,
    PokeId: -1,
    CompositionId: -1,
    Name: "N/A",
    Purpose: "N/A",
    ImageURL: "../../../assets/pokemon/mystery.jpg",
    ApiURL: "N/A"
  }*/]

  currentViewPokemon: PokemonAPI = {}
  currentSearchPokemon: PokemonAPI = {}

  item: ItemInterface = {
    Id: -1,
    PokeId: -1,
    CompositionId: -1,
    Name: "N/A",
    Purpose: "N/A",
    ImageURL: "../../../assets/items/mystery.jpg",
    ApiURL: "N/A"
  }

  items: ItemInterface[] = [/*{
    Id: -1,
    PokeId: -1,
    CompositionId: -1,
    Name: "N/A",
    Purpose: "N/A",
    ImageURL: "../../../assets/items/mystery.jpg",
    ApiURL: "N/A"
  }*/]

  currentViewItem: ItemAPI = {}
  currentSearchItem: ItemAPI = {}

  isLoading: boolean = false;
  cacheData: boolean = false;
  isSearching: boolean = false;
  isBuildSelected: boolean = false;
  isCompositionUpdate: boolean = false;

  isPokemonAdd: boolean = false;
  isPokemonView: boolean = false;
  isPokemonUpdate: boolean = false;
  isPokemonConfirmed: boolean = false;

  isItemAdd: boolean = false;
  isItemView: boolean = false;
  isItemUpdate: boolean = false;
  isItemConfirmed: boolean = false;

  p: number = 1;
  itemsPerPage = 12;
  totalBuilds: any;
  searchTerm = '';
  filteredSearchBuilds: BuildInterface[] = [];
  filteredBuilds: BuildInterface[] = [];

  constructor(
    private authToken: AuthToken,
    private userService: UserService,
    private pokemonService: PokemonService,
    protected dateService: DateService,
    private passConfValidator: PasswordConfirmationValidator,
    protected imageUpload: ImageUpload,
    private commonReload: ReloadComponent,
    protected modalService: ModalService,
    private pokemonAPI: PokemonAPIService
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.pokemonService.isProfileInitialized.subscribe(value => {
      this.isInitialized = value;
    });

    this.modalService.close();

    this.updateUserForm = new FormGroup({
      Id: new FormControl(-1, [Validators.required, Validators.min(1)]),
      UserName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      FirstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      LastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ProfilePicName: new FormControl(''),
      ProfilePicUrl: new FormControl(''),
    });

    this.addBuildForm = new FormGroup({
      Id: new FormControl(-1),
      UserId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      GameVersion: new FormControl('', [Validators.required, Validators.minLength(4)]),
      Description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(null, [Validators.required]),
      DateUpdated: new FormControl(null, [Validators.required])
    });

    this.updateBuildForm = new FormGroup({
      Id: new FormControl(-1, [Validators.required, Validators.min(1)]),
      UserId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      GameVersion: new FormControl('', [Validators.required, Validators.minLength(4)]),
      Description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(null),
      DateUpdated: new FormControl(null, [Validators.required])
    });

    this.addCompositionForm = new FormGroup({
      Id: new FormControl(-1, [Validators.required, Validators.min(1)]),
      BuildId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      Description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(null, [Validators.required]),
      DateUpdated: new FormControl(null, [Validators.required])
    });

    this.updateCompositionForm = new FormGroup({
      Id: new FormControl(-1, [Validators.required, Validators.min(1)]),
      BuildId: new FormControl(-1, [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      Description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(null),
      DateUpdated: new FormControl(null, [Validators.required])
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

    this.updatePokemonForm = new FormGroup({
      Id: new FormControl(-1, [Validators.required, Validators.min(1)]),
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

    this.updateItemForm = new FormGroup({
      Id: new FormControl(-1, [Validators.required, Validators.min(1)]),
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

    this.getUserProfile();

    if (!this.isUserLoggedIn) {

      return;

    }

    if (!this.isInitialized) {

      this.pokemonService.getBuildByUserId(this.authToken.getUserId()).subscribe({
        next: (response) => {

          this.builds = response.Builds!;

          for (const build of this.builds) {

            build.DateCreated = this.dateService.transformToLocaleDate(build.DateCreated!);
            build.DateUpdated = this.dateService.transformToLocaleDate(build.DateUpdated!);

            this.pokemonService.getCompositionByBuildId(build.Id!).subscribe({
              next: (response) => {

                const compositions = response.Compositions || [];

                for (const composition of compositions) {

                  composition.DateCreated = this.dateService.transformToLocaleDate(composition.DateCreated!);
                  composition.DateUpdated = this.dateService.transformToLocaleDate(composition.DateUpdated!);

                  const pokemonObservable = this.pokemonService.getPokemonByCompositionId(composition.Id!);
                  const itemObservable = this.pokemonService.getItemsByCompositionId(composition.Id!);

                  forkJoin([pokemonObservable, itemObservable]).subscribe(([pokemonResponse, itemResponse]) => {
                    const pokemons = pokemonResponse.Pokemons || [];
                    const items = itemResponse.Items || [];

                    this.pokemons.push(...pokemons);
                    this.items.push(...items);
                    this.compositions.push(composition);

                  });

                }

              },
              error: (err: HttpErrorResponse) => {

                this.alertMessage = err.message;
                this.alertError = true;

              }
            });

          }

          this.pokemonService.builds.next(this.builds);
          this.pokemonService.compositions.next(this.compositions);
          this.pokemonService.pokemon.next(this.pokemons);
          this.pokemonService.items.next(this.items);
          this.pokemonService.isProfileInitialized.next(true);

          const latestBuild = this.builds.reduce((latest: BuildInterface | null, current: BuildInterface) => {
            const currentDate = new Date(current.DateUpdated!);
            return !latest || currentDate > new Date(latest.DateUpdated!) ? current : latest;
          }, null);

          this.latestBuild = latestBuild!;
          this.filteredBuilds = this.builds;
          this.totalBuilds = this.builds.length;

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

      this.pokemonService.pokemon.subscribe(value => {
        this.pokemons = value;
      });

      this.pokemonService.items.subscribe(value => {
        this.items = value;
      });

      const latestBuild = this.builds.reduce((latest: BuildInterface | null, current: BuildInterface) => {
        const currentDate = new Date(current.DateUpdated!);
        return !latest || currentDate > new Date(latest.DateUpdated!) ? current : latest;
      }, null);

      this.latestBuild = latestBuild!;
      this.filteredBuilds = this.builds;
      this.totalBuilds = this.builds.length;

    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }

  protected validateControl = (controlName: string, form: FormGroup) => {
    return form.get(controlName)!.invalid && form.get(controlName)!.touched
  }

  protected hasError = (controlName: string, errorName: string, form: FormGroup) => {
    return form.get(controlName)!.hasError(errorName)
  }

  protected searchBuilds(): void {

    if (this.filteredSearchBuilds.length !== 0) {

      this.filteredSearchBuilds = [];
      this.isSearching = true;
      this.isBuildSelected = false;

    }

    if (this.searchTerm !== '') {

      const buildFilter = this.builds.filter(build => build.Name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.filteredSearchBuilds.splice(0, this.builds.length, ...buildFilter);
      this.isSearching = true;

    } else {

      this.isSearching = false;
      this.isBuildSelected = false;

    }

  }

  protected async searchPokemon(): Promise<void> {

    this.currentSearchPokemon = {};

    await this.pokemonAPI.getPokemonByIdName(this.searchTerm).subscribe((response) => {

      this.currentSearchPokemon = response;

    })

  }

  protected async searchItem(): Promise<void> {

    this.currentSearchItem = {};

    await this.pokemonAPI.getItemByIdName(this.searchTerm).subscribe((response) => {

      this.currentSearchItem = response;

    })

  }

  protected getFilteredBuild(buildId: number): void {

    const buildFilter = this.builds.filter(build => build.Id?.toString().includes(buildId.toString()));
    this.filteredSearchBuilds.splice(0, this.builds.length, ...buildFilter);
    this.isBuildSelected = true;

  }

  protected getUserProfile(): void {

    if (this.isUserLoggedIn) {

      this.userService.getById(this.authToken.getUserId()).subscribe({
        next: (response) => {

          this.user = response.User!;

        },
        error: (err: HttpErrorResponse) => {

          this.alertMessage = err.message;
          this.alertError = true;

        }
      })

    }

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected initializeUpdateForm() {

    this.updateUserForm = new FormGroup({
      Id: new FormControl(this.authToken.getUserId()),
      UserName: new FormControl(this.user.UserName, [Validators.required, Validators.minLength(4)]),
      FirstName: new FormControl(this.user.FirstName, [Validators.required, Validators.minLength(3)]),
      LastName: new FormControl(this.user.LastName, [Validators.required, Validators.minLength(3)]),
      Email: new FormControl(this.user.Email, [Validators.required, Validators.minLength(3)]),
      Password: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ProfilePicName: new FormControl(''),
      ProfilePicUrl: new FormControl('')
    });

    this.updateUserForm.get('ConfirmPassword')!.setValidators([Validators.required,
    this.passConfValidator.validateConfirmPassword(this.updateUserForm.get('Password')!)]);

  }

  protected updateUser = (updateUserFormValue: any) => {

    const formValues = { ...updateUserFormValue };

    const updatedUser: UserUpdate = {
      Id: this.authToken.getUserId(),
      UserName: formValues.UserName,
      FirstName: formValues.FirstName,
      LastName: formValues.LastName,
      Email: formValues.Email,
      Password: formValues.Password,
      ProfilePicName: this.imageUpload.imageName,
      ProfilePicUrl: this.user.ProfilePicUrl
    };

    if (this.imageUpload.imageSrc.name !== "" || this.imageUpload.imageSrc.type !== "") {

      this.imageUpload.uploadProfilePicture(this.imageUpload.imageSrc!, this.authToken.getUserId()).subscribe({
        error: (err: HttpErrorResponse) => {

          this.alertMessage = err.message;
          this.alertError = true;

        }
      })

    }

    this.userService.update(updatedUser).subscribe({
      next: (response) => {

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 3000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected initializeAddBuildForm() {

    this.addBuildForm = new FormGroup({
      Id: new FormControl(-1),
      UserId: new FormControl(this.authToken.getUserId(), [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      GameVersion: new FormControl('', [Validators.required, Validators.minLength(4)]),
      Description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(new Date(), [Validators.required]),
      DateUpdated: new FormControl(new Date(), [Validators.required])
    });

  }

  protected addBuild = (addBuildFormValue: any) => {

    const formValues = { ...addBuildFormValue };

    const build: BuildInterface = {
      Id: -1,
      UserId: this.authToken.getUserId(),
      Name: formValues.Name,
      GameVersion: formValues.GameVersion,
      Description: formValues.Description,
      DateCreated: new Date(),
      DateUpdated: new Date()
    };

    this.pokemonService.addBuild(build).subscribe({
      next: (response) => {

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected initializeUpdateBuildForm(
    buildId: number,
    userId: number,
    name: string,
    gameVersion: string,
    description: string
  ) {

    this.updateBuildForm = new FormGroup({
      Id: new FormControl(buildId, [Validators.required, Validators.min(1)]),
      UserId: new FormControl(userId, [Validators.required, Validators.min(1)]),
      Name: new FormControl(name, [Validators.required, Validators.minLength(4)]),
      GameVersion: new FormControl(gameVersion, [Validators.required, Validators.minLength(4)]),
      Description: new FormControl(description, [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(null),
      DateUpdated: new FormControl(new Date(), [Validators.required])
    });

  }

  protected updateBuild = (updateBuildFormValue: any) => {

    const formValues = { ...updateBuildFormValue };

    const build: BuildInterface = {
      Id: formValues.Id,
      UserId: this.authToken.getUserId(),
      Name: formValues.Name,
      GameVersion: formValues.GameVersion,
      Description: formValues.Description,
      DateCreated: undefined,
      DateUpdated: new Date()
    };

    this.pokemonService.updateBuildByUserId(build, build.Id!, build.UserId!).subscribe({
      next: (response) => {

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected deleteBuild = async (buildId: number, userId: number) => {

    await Promise.all(this.compositions.map(async (composition) => {

      if (composition.BuildId === buildId) {

        await this.deleteComposition(composition.Id!, composition.BuildId!, true);

      }

    })).then(() => {

      this.pokemonService.deleteBuildByUserId(buildId, userId).subscribe({
        next: (response) => {

          this.alertMessage = response.SystemMessage!;
          this.alertSuccess = true;

          this.pokemonService.isProfileInitialized.next(false);

          setTimeout(() => {
            this.commonReload.reloadComponent(true);
          }, 1000);
        },
        error: (err: HttpErrorResponse) => {

          this.alertMessage = err.message;
          this.alertError = true;
        }

      });

    });

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

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

  protected initializeAddCompositionForm(buildId: number) {

    this.addCompositionForm = new FormGroup({
      Id: new FormControl(-1),
      BuildId: new FormControl(buildId, [Validators.required, Validators.min(1)]),
      Name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      Description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(new Date(), [Validators.required]),
      DateUpdated: new FormControl(new Date(), [Validators.required])
    });

  }

  protected addComposition = (addCompositionFormValue: any) => {

    const formValues = { ...addCompositionFormValue };

    const composition: CompositionInterface = {
      Id: -1,
      BuildId: formValues.BuildId,
      Name: formValues.Name,
      Description: formValues.Description,
      DateCreated: new Date(),
      DateUpdated: new Date()
    };

    this.pokemonService.addComposition(composition).subscribe({
      next: async (response) => {

        await this.updateBuildDate(composition.BuildId!);

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected initializeUpdateCompositionForm(
    compositionId: number,
    buildId: number,
    name: string,
    description: string
  ) {

    this.updateCompositionForm = new FormGroup({
      Id: new FormControl(compositionId, [Validators.required, Validators.min(1)]),
      BuildId: new FormControl(buildId, [Validators.required, Validators.min(1)]),
      Name: new FormControl(name, [Validators.required, Validators.minLength(4)]),
      Description: new FormControl(description, [Validators.required, Validators.minLength(10)]),
      DateCreated: new FormControl(null),
      DateUpdated: new FormControl(new Date(), [Validators.required])
    });

    this.isCompositionUpdate = true;

  }

  protected updateComposition = (updateCompositionFormValue: any) => {

    const formValues = { ...updateCompositionFormValue };

    const composition: CompositionInterface = {
      Id: formValues.Id,
      BuildId: formValues.BuildId,
      Name: formValues.Name,
      Description: formValues.Description,
      DateCreated: undefined,
      DateUpdated: new Date()
    };

    this.pokemonService.updateCompositionByBuildId(composition, composition.Id!, composition.BuildId!).subscribe({
      next: async (response) => {

        await this.updateBuildDate(composition.BuildId!);

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

    this.isCompositionUpdate = false;
    this.modalService.close();

  }

  protected deleteComposition = async (compositionId: number, buildId: number, isFromBuild: boolean) => {

    await Promise.all(this.pokemons.map((pokemon) => {

      if (pokemon.CompositionId! === compositionId) {

        this.pokemonService.deletePokemonByCompositionId(pokemon.Id!, pokemon.CompositionId).subscribe({
          next: (response) => {}
        });
        

      }

    })).then(async () => {

      await Promise.all(this.items.map((item) => {

        if (item.CompositionId! === compositionId) {

          this.pokemonService.deleteItemByCompositionId(item.Id!, item.CompositionId).subscribe({
            next: (response) => {}
          });

        }

      }));

    }).then(() => {

      this.pokemonService.deleteCompositionByBuildId(compositionId, buildId).subscribe({
        next: async (response) => {

          if (isFromBuild) {
            return;
          }

          await this.updateBuildDate(buildId!);

          this.alertMessage = response.SystemMessage!;
          this.alertSuccess = true;

          this.pokemonService.isProfileInitialized.next(false);

          setTimeout(() => {
            this.commonReload.reloadComponent(true);
          }, 1000);

        },
        error: (err: HttpErrorResponse) => {

          this.alertMessage = err.message;
          this.alertError = true;

        }
      });

    });

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected getCompositionDetails(compositionId: number): void {

    this.currentComposition = this.compositions.find(c => c.Id === compositionId)!;

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

    this.isPokemonConfirmed = true;

  }

  protected addPokemon = (addPokemonFormValue: any) => {

    if (!this.isPokemonConfirmed || this.currentSearchPokemon === undefined) {

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

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

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

  protected resetPokemonAddForm(): void {

    this.isPokemonAdd = false;
    this.currentSearchPokemon = new Object();
    this.isPokemonConfirmed = false;

  }

  protected initializeUpdatePokemonForm(
    pokemonId: number,
    pokeId: number,
    compositionId: number,
    name: string,
    purpose: string,
    imageURL: string,
    apiURL: string
  ) {

    this.updatePokemonForm = new FormGroup({
      Id: new FormControl(pokemonId, [Validators.required, Validators.min(1)]),
      PokeId: new FormControl(pokeId, [Validators.required, Validators.min(1)]),
      CompositionId: new FormControl(compositionId, [Validators.required, Validators.min(1)]),
      Name: new FormControl(name, [Validators.required]),
      Purpose: new FormControl(purpose, [Validators.required, Validators.minLength(10)]),
      ImageURL: new FormControl(imageURL, [Validators.required]),
      ApiURL: new FormControl(apiURL, [Validators.required])
    });

    this.isPokemonUpdate = true;

  }

  protected updatePokemon = (updatePokemonFormValue: any) => {

    const formValues = { ...updatePokemonFormValue };

    const pokemon: PokemonInterface = {
      Id: formValues.Id,
      PokeId: formValues.PokeId,
      CompositionId: formValues.CompositionId,
      Name: formValues.Name,
      Purpose: formValues.Purpose,
      ImageURL: formValues.ImageURL,
      ApiURL: formValues.ApiURL
    };

    this.pokemonService.updatePokemonByCompositionId(pokemon, pokemon.Id!, pokemon.CompositionId!).subscribe({
      next: async (response) => {

        await this.updateCompositionDate(pokemon.CompositionId!);

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

    this.isPokemonUpdate = false;
    this.modalService.close();

  }

  protected resetPokemonUpdateForm(): void {

    this.isPokemonUpdate = false;

  }

  protected deletePokemon = (event: Event, pokemonId: number, compositionId: number) => {

    event.stopPropagation();

    this.pokemonService.deletePokemonByCompositionId(pokemonId, compositionId).subscribe({
      next: async (response) => {

        await this.updateCompositionDate(compositionId!);

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected async viewPokemon(pokemonName: string, Id: number): Promise<void> {

    await this.pokemonAPI.getPokemonByIdName(pokemonName).subscribe((response) => {

      this.currentViewPokemon = response;

    })

    await this.pokemonService.getPokemonById(Id).subscribe((response) => {

      this.pokemon = response.Pokemon!;

    })

    this.isPokemonView = true;
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

    this.isItemConfirmed = true;

  }

  protected addItem = (addItemFormValue: any) => {

    if (!this.isItemConfirmed || this.currentSearchItem === undefined) {

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

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

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

  protected resetItemAddForm(): void {

    this.isItemAdd = false;
    this.currentSearchItem = new Object();
    this.isItemConfirmed = false;

  }

  protected initializeUpdateItemForm(
    pokemonId: number,
    pokeId: number,
    compositionId: number,
    name: string,
    purpose: string,
    imageURL: string,
    apiURL: string
  ) {

    this.updateItemForm = new FormGroup({
      Id: new FormControl(pokemonId, [Validators.required, Validators.min(1)]),
      PokeId: new FormControl(pokeId, [Validators.required, Validators.min(1)]),
      CompositionId: new FormControl(compositionId, [Validators.required, Validators.min(1)]),
      Name: new FormControl(name, [Validators.required]),
      Purpose: new FormControl(purpose, [Validators.required, Validators.minLength(10)]),
      ImageURL: new FormControl(imageURL, [Validators.required]),
      ApiURL: new FormControl(apiURL, [Validators.required])
    });

    this.isItemUpdate = true;

  }

  protected updateItem = (updateItemFormValue: any) => {

    const formValues = { ...updateItemFormValue };

    const item: ItemInterface = {
      Id: formValues.Id,
      PokeId: formValues.PokeId,
      CompositionId: formValues.CompositionId,
      Name: formValues.Name,
      Purpose: formValues.Purpose,
      ImageURL: formValues.ImageURL,
      ApiURL: formValues.ApiURL
    };

    this.pokemonService.updateItemByCompositionId(item, item.Id!, item.CompositionId!).subscribe({
      next: async (response) => {

        await this.updateCompositionDate(item.CompositionId!);

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

    this.isItemUpdate = false;
    this.modalService.close();

  }

  protected resetItemUpdateForm(): void {

    this.isItemUpdate = false;

  }

  protected deleteItem = (event: Event, itemId: number, compositionId: number) => {

    event.stopPropagation();

    this.pokemonService.deleteItemByCompositionId(itemId, compositionId).subscribe({
      next: async (response) => {

        await this.updateCompositionDate(compositionId!);

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        this.pokemonService.isProfileInitialized.next(false);

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
        }, 1000);

      },
      error: (err: HttpErrorResponse) => {

        this.alertMessage = err.message;
        this.alertError = true;

      }
    })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  protected async viewItem(itemName: string, Id: number): Promise<void> {

    await this.pokemonAPI.getItemByIdName(itemName).subscribe((response) => {

      this.currentViewItem = response;

    })

    await this.pokemonService.getItemById(Id).subscribe((response) => {

      this.item = response.Item!;

    })

    this.isItemView = true;
  }

}
