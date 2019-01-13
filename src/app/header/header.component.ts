import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {UsersService} from '../services/users.service';
import {User} from '../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  user: User;

  constructor(private authService: AuthService, private userService: UsersService) {
    this.userService.userSubject.subscribe((u) => {
      this.user = u;
    });
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );


  }

  onSignOut() {
    this.authService.signOutUser();
  }

}
