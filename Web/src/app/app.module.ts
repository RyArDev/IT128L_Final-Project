import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

import { AuthInterceptor } from '../services/auth/auth-interceptor';
import { ErrorHandler } from '../services/error/error-handler';
import { FooterComponent } from './components/footer/footer.component';
import { AlertSystemComponent } from './components/alert-system/alert-system.component';
import { PokemonPageComponent } from './components/pokemon-page/pokemon-page.component';
import { ItemPageComponent } from './components/item-page/item-page.component';
import { BuildPageComponent } from './components/build-page/build-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    HomePageComponent,
    NotFoundComponent,
    NavBarComponent,
    ProfilePageComponent,
    FooterComponent,
    AlertSystemComponent,
    PokemonPageComponent,
    ItemPageComponent,
    BuildPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomePageComponent },
      { path: 'pokemon', component: PokemonPageComponent },
      { path: 'items', component: ItemPageComponent },
      { path: 'builds', component: BuildPageComponent },
      { path: 'register', component: RegisterPageComponent },
      { path: 'login', component: LoginPageComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: '404', component: NotFoundComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: '**', redirectTo: '/404', pathMatch: 'full' }
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandler,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }


/* PokeAPI - https://pokeapi.co/docs/v2

Wrapper Libraries
Node Server-side with auto caching: Pokedex Promise v2 by Thomas Asadurian and Alessandro Pezzé - https://github.com/PokeAPI/pokedex-promise-v2
Browser-side with auto caching: pokeapi-js-wrapper by Alessandro Pezzé - https://github.com/PokeAPI/pokeapi-js-wrapper
.NET (C#, VB, etc): PokeApi.NET by PoroCYon - https://github.com/mtrdp642/PokeApiNet
Typescript with auto caching: Pokenode-ts by Gabb-c - https://github.com/Gabb-c/pokenode-ts

*/
