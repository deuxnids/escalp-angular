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

  constructor(private formBuilder: FormBuilder, private userServices: UsersService, private transportService: TransportsService,
              private router: Router) {
  }

  ngOnInit() {
    this.userSubscription = this.userServices.userSubject.subscribe((user: User) => {
      this.user = user;
    });
    this.userServices.emitUser();
  }


}
