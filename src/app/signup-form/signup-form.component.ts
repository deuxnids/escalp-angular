import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {TransportsService} from '../services/transports.service';
import {AuthService} from '../services/auth.service';
import {UsersService} from '../services/users.service';
import {User} from '../models/user.model';

interface MailChimpResponse {
  result: string;
  msg: string;
}


@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  submitted = false;
  error = '';
  filteredStations = [];
  edit = true;
  button = 'modifier';

  profileForm: FormGroup;
  @Input() user: User;

  constructor(private http: HttpClient, private router: Router, private transportService: TransportsService,
              private authService: AuthService, private userServices: UsersService) {


  }


  ngOnInit() {


    console.log(this.user);
    if (this.user == null) {
      this.edit = false;
      this.user = new User();
      this.button = 's\'inscrire';
    }

    this.profileForm = new FormGroup({
      // reactive form components
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
      firstName: new FormControl(this.user.first_name, [
        Validators.required
      ]),

      lastName: new FormControl(this.user.last_name, [
        Validators.required
      ]),
      password: new FormControl('', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]),
      ptStop: new FormControl(this.user.origin, [
        Validators.required
      ])
    });


    this.profileForm
      .get('ptStop')
      .valueChanges
      .pipe(
        switchMap(value => this.transportService.search(value)
        )
      )
      .subscribe(stations => {
        this.filteredStations = stations.stations;
      });
  }


  submit() {
    const email = this.profileForm.get('email').value;
    const f_name = this.profileForm.get('firstName').value;
    const l_name = this.profileForm.get('lastName').value;
    const origin = this.profileForm.get('ptStop').value;
    const password = this.profileForm.get('password').value;


    if (this.edit) {
      this.authService.changePassword(password).then(
        (_user) => {
          this.user.email = email;
          this.user.first_name = f_name;
          this.user.last_name = l_name;
          this.user.origin = origin;
          this.userServices.createUser(this.user, _user['user'].uid).then(() => {
            this.router.navigate(['/outings']);
          }, (error) => {
            console.log(error);
          });
        },
        (error) => {
          this.error = error;
        }
      );


    } else {

      this.authService.createNewUser(email, password).then(
        (_user) => {
          this.user.email = email;
          this.user.first_name = f_name;
          this.user.last_name = l_name;
          this.user.origin = origin;
          this.userServices.createUser(this.user, _user['user'].uid).then(() => {
            this.router.navigate(['/outings']);
          }, (error) => {
            console.log(error);
          });
        },
        (error) => {
          this.error = error;
        }
      );


    }


  }

}
