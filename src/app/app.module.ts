import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {HeaderComponent} from './header/header.component';
import {RouterModule, Routes} from '@angular/router';
import {OutingListComponent} from './outing-list/outing-list.component';
import {OutingsService} from './services/outings.service';
import {SingleOutingComponent} from './outing-list/single-outing/single-outing.component';
import {MapComponent} from './map/map.component';
import {TransportsService} from './services/transports.service';
import {PlanComponent} from './plan/plan.component';
import {ProfileComponent} from './profile/profile.component';
import {UsersService} from './services/users.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatAutocompleteModule,
  MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatSliderModule
} from '@angular/material';
import {PlannerService} from './services/planner.service';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SignupFormComponent} from './signup-form/signup-form.component';
import {JsonpModule} from '@angular/http';


const appRoutes: Routes = [
  {path: 'auth/signup', component: SignupComponent},
  {path: 'auth/signin', component: SigninComponent},
  {path: 'outings', component: OutingListComponent},
  {path: 'outings/:id', component: SingleOutingComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'signin', component: SigninComponent},
  {path: '', component: LandingPageComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    HeaderComponent,
    OutingListComponent,
    SingleOutingComponent,
    MapComponent,
    PlanComponent,
    ProfileComponent,
    LandingPageComponent,
    SignupFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatSliderModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    HttpClientJsonpModule

  ],
  providers: [AuthService, OutingsService, TransportsService, UsersService, PlannerService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
