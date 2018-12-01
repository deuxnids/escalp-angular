import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {DataSnapshot} from 'firebase/database';
import {User} from '../models/user.model';
import {Subject} from 'rxjs';


@Injectable()
export class UsersService {
  uid;
  user: User = new User();
  userSubject = new Subject<User>();


  constructor() {
    this.getUser();
  }


  emitUser() {
    this.userSubject.next(this.user);
  }

  saveUser(user: User) {
    firebase.database().ref('users/' + this.uid).set(user);
  }

  getUser() {
    firebase.auth().onAuthStateChanged(authUser => {
      this.uid = authUser.uid;

      firebase.database().ref('users/' + this.uid).on('value', (data) => {
        this.user = data.val();
        this.emitUser();
      });
    });
  }
}

