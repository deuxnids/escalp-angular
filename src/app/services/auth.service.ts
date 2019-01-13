import {Injectable} from '@angular/core';
import * as firebase from 'firebase';


@Injectable()
export class AuthService {

  constructor() {
  }

  createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          (user) => {
            resolve(user);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  changePassword(password) {
    const user = firebase.auth().currentUser;
    return new Promise((resolve, reject) => {
      user.updatePassword(password).then(() => resolve({user: user}), reject);
    });
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signOutUser() {
    firebase.auth().signOut();
  }
}
