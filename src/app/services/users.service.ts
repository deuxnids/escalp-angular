import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {DataSnapshot} from 'firebase/database';
import {User} from '../models/user.model';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class UsersService {
  uid;
  user: User;
  userSubject = new Subject<User>();


  constructor() {

    firebase.database().ref('users/' + 'skMxTbf6gedeciwyEfxUwe7Dacs1').on('value', (data) => {
      if (data.val() !== undefined) {
        this.user = data.val();
        this.emitUser();
        this.onAuthStateChanged();
      }
    });


  }

  saveToken(token: String) {
    this.getUser(token);
  }

  createUser(user: User, u_id: string) {
    return firebase.database().ref('users/' + u_id).set(user);
  }


  emitUser() {
    this.userSubject.next(this.user);
  }

  saveUser(user: User) {
    firebase.database().ref('users/' + this.uid).set(user);
  }

  onAuthStateChanged() {
    firebase.auth().onAuthStateChanged(authUser => {
      if (authUser !== null) {
        this.uid = authUser.uid;
        this.getUser(this.uid);
      }
    });
  }

  getUser(uid) {


    firebase.database().ref('users/' + uid).on('value', (data) => {
      if (data.val() !== undefined) {

        this.user = data.val();
        this.emitUser();
      }
    });

  }
}

