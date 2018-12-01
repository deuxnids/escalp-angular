import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../models/user.model';
import {UsersService} from '../services/users.service';
import {Subscription} from 'rxjs';
import {TransportsService} from '../services/transports.service';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  user: User;
  userSubscription: Subscription;
  filteredStations: String[] = ['a', 'v'];
  all_sports = ['Escalade', 'Randonnée', 'Ski de randonnée', 'Alpinisme'];

  constructor(private formBuilder: FormBuilder, private userServices: UsersService, private transportService: TransportsService,
              private router: Router) {
  }

  ngOnInit() {
    this.userSubscription = this.userServices.userSubject.subscribe((user: User) => {
      this.user = user;
      this.initForm();
    });
    this.userServices.emitUser();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      sports: [this.user.sports, Validators.required],
      basecamp: [this.user.basecamps, Validators.required],
    });

    this.form
      .get('basecamp')
      .valueChanges
      .pipe(
        switchMap(value => this.transportService.search({name: value})
        )
      )
      .subscribe(stations => {
        console.log(stations);
        this.filteredStations = stations.stations;
      });
  }


  onSave() {
    this.user.name = this.form.get('name').value;
    this.user.sports = this.form.get('sports').value;
    this.user.basecamps = this.form.get('basecamp').value;
    this.userServices.saveUser(this.user);
  }

}
