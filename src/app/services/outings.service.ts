import {Injectable} from '@angular/core';
import {Outing} from '../models/outing.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase/app';
import {DataSnapshot} from 'firebase/database';
import {Data} from '@angular/router';


@Injectable()
export class OutingsService {

  outings: Outing[] = [];
  outingssSubject = new Subject<Outing[]>();

  constructor() {
    this.getBooks();
  }


  emitOutings() {
    this.outingssSubject.next(this.outings);
  }

  saveBooks() {
    firebase.database().ref('/outings').set(this.outings);
  }

  getBooks() {
    firebase.database().ref('/outings')
      .on('value', (data: DataSnapshot) => {
          const values = data.val();
          const keys = Object.keys(values);

          this.outings = keys.map(function (key) {
            const d = values[key];
            d['uid'] = key;
            return d;
          });

          this.emitOutings();
        }
      );
  }

  getSingleBook(id: string, cb) {
    firebase.database().ref('/outings/' + id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }


  createNewOuting(newOuting: Outing) {
    this.outings.push(newOuting);
    this.saveBooks();
    this.emitOutings();
  }

  removeOuting(book: Outing) {
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }

    const bookIndexToRemove = this.outings.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return true;
        }
      }
    );
    this.outings.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitOutings();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }

}
