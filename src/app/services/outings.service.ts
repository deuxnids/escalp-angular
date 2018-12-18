import {Injectable} from '@angular/core';
import {Outing} from '../models/outing.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase/app';
import {DataSnapshot} from 'firebase/database';
import {Data} from '@angular/router';


@Injectable()
export class OutingsService {


  constructor() {
  }


  getOutings(n: number, cb) {
    firebase.database().ref('/outings').limitToFirst(n)
      .on('value', (data: DataSnapshot) => {
          const values = data.val();
          const keys = Object.keys(values);

          const outings = keys.map(function (key) {
            const d = values[key];
            d['uid'] = key;
            return d;
          });
          cb(outings);

        }
      );
  }

  getSingleBook(id: string, cb) {
    firebase.database().ref('/outings/' + id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }


}
