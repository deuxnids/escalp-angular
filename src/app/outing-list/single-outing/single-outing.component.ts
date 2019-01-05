import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OutingsService} from '../../services/outings.service';
import {Outing} from '../../models/outing.model';
import {UsersService} from '../../services/users.service';


@Component({
  selector: 'app-single-outing',
  templateUrl: './single-outing.component.html',
  styleUrls: ['./single-outing.component.scss']
})


export class SingleOutingComponent implements OnInit {

  outing: Outing;
  dangers: string[];
  weathers: any[];
  id: string;
  p_id: string;
  loading: boolean;
  from: string;
  user: string;
  source: string;
  pt_to: string;
  pt_departure: string;
  pt_arrival: string;
  car_duration: number;
  pt_duration: number;

  constructor(private route: ActivatedRoute, private booksService: OutingsService,
              private router: Router, private userService: UsersService) {
  }

  ngOnInit() {
    this.from = '';

    this.user = null;
    this.loading = true;
    this.weathers = [];
    this.dangers = [];

    this.outing = new Outing();

    this.id = this.route.snapshot.params['id'];
    this.p_id = this.route.snapshot.params['p_id'];
    this.userService.saveToken(this.p_id);

    this.booksService.getRecoUser(this.p_id, data => {
      this.user = data['FNAME'] + ' ' + data['LNAME'];
      this.from = data['STATION'];

      this.booksService.getAccess(this.from, this.id, access => {
        if (access != null) {
          console.log(access);
          this.pt_arrival = access['pt_arrival'];
          this.pt_departure = access['pt_departure'];
          this.pt_to = access['pt_to'];
          this.pt_duration = access['pt_duration'];
          this.car_duration = access['car_duration'];
          this.from = access['from_station'];
        }
      });


    });


    this.booksService.getConditions(this.id, conditions => {
      this.dangers = conditions.avalanches;
      this.weathers = conditions.weather;
    });


    this.booksService.getSingleBook(this.id,
      (book: Outing) => {
        this.outing = book;
        this.loading = false;
        const urls = this.outing.source.split('/');
        this.source = urls[urls.length - 1];
        this.source = 'https://www.camptocamp.org/routes/' + this.source;
      });
  }

  update() {
    this.router.navigate(['/outings/update/' + this.id]);
  }

  onBack() {
    this.router.navigate(['/outings']);
  }
}
