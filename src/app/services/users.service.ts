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
    this.onAuthStateChanged();
  }

  loadDefaultUser() {
    firebase.database().ref('users/' + 'skMxTbf6gedeciwyEfxUwe7Dacs1').once('value', (data) => {
      if (data.val() !== undefined) {
        this.user = data.val();
        this.emitUser();
        this.onAuthStateChanged();
      }
    });
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
        console.log(this.uid);
        this.getUserCB(this.uid, user => {
          this.user = user;
          this.emitUser();
        });
      }
    });
  }

  setHIde(r_id, value) {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid + '/hides/' + r_id).set({'value': value});

  }

  getNotToShow() {

  }

  setToDo(r_id, value) {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid + '/todos/' + r_id).set({'value': value});
  }

  getToDos() {

  }

  getUser(uid) {


    firebase.database().ref('users/' + uid).once('value', (data) => {
      if (data.val() !== undefined) {

        this.user = data.val();
        this.emitUser();
      }
    });

  }

  getUserCB(uid, cb) {

    firebase.database().ref('users/' + uid).once('value', (data) => {
      if (data.val() !== undefined) {
        cb(data.val());
      }
    });


  }

  signout() {
    firebase.auth().signOut();
  }
}

