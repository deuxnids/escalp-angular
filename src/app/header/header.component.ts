import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {UsersService} from '../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  token = 'fdc0250bbb251d504e7d2e4457750e6a';

  constructor(private authService: AuthService, private userService: UsersService) {
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

    this.userService.tokenSubject.subscribe(token => {
      this.token = token;
    });

  }

  onSignOut() {
    this.authService.signOutUser();
  }

}
