import {Component} from '@angular/core';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']


})
export class AppComponent {
  title = 'escalp-angular';

  constructor() {
    const config = {
      apiKey: 'AIzaSyCYF1SQ5muyPyNqxJ8qR9UV3aZtcRPC4QQ',
      authDomain: 'escalp-7b5f8.firebaseapp.com',
      databaseURL: 'https://escalp-7b5f8.firebaseio.com',
      projectId: 'escalp-7b5f8',
      storageBucket: 'escalp-7b5f8.appspot.com',
      messagingSenderId: '450820143031'
    };
    firebase.initializeApp(config);
  }

}
