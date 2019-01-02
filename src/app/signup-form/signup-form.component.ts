import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {TransportsService} from '../services/transports.service';

interface MailChimpResponse {
  result: string;
  msg: string;
}


@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

  submitted = false;
  mailChimpEndpoint = 'https://nest-or.us19.list-manage.com/subscribe/post-json?u=970a4e52e4efd4ad7e9b1f1fc&amp;id=552300db50&';
  error = '';
  filteredStations = [];

  profileForm = new FormGroup({
    // reactive form components
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    firstName: new FormControl('', [
      Validators.required
    ]),

    lastName: new FormControl('', [
      Validators.required
    ]),
    ptStop: new FormControl('', [
      Validators.required
    ])
  });


  constructor(private http: HttpClient, private router: Router, private transportService: TransportsService) {
  }

  ngOnInit() {
    this.profileForm
      .get('ptStop')
      .valueChanges
      .pipe(
        switchMap(value => this.transportService.search(value)
        )
      )
      .subscribe(stations => {
        console.log(stations);
        this.filteredStations = stations.stations;
      });
  }


  submit() {
    this.error = '';
    if (this.profileForm.valid) {
      const value = this.profileForm.value;
      console.log(value);

      const params = new HttpParams()
        .set('EMAIL', value['email'])
        .set('FNAME', value['firstName'])
        .set('LNAME', value['lastName'])
        .set('STATION', value['ptStop'])
        .set('b_970a4e52e4efd4ad7e9b1f1fc_552300db50', ''); // hidden input name

      const mailChimpUrl = this.mailChimpEndpoint + params.toString();

      // 'c' refers to the jsonp callback param key. This is specific to Mailchimp
      this.http.jsonp<MailChimpResponse>(mailChimpUrl, 'c').subscribe(response => {
        if (response.result && response.result !== 'error') {
          this.submitted = true;
          this.router.navigate(['outings']);
        } else {
          this.error = response.msg;
        }
      }, error => {
        console.error(error);
        this.error = 'Sorry, an error occurred.';
      });
    } else {
    }
  }

}
