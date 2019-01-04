import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OutingsService} from '../../services/outings.service';
import {Outing} from '../../models/outing.model';

@Component({
  selector: 'app-single-outing',
  templateUrl: './single-outing.component.html',
  styleUrls: ['./single-outing.component.scss']
})
export class SingleOutingComponent implements OnInit {

  outing: Outing;
  dangers: string[];
  connections: string[];
  weathers: any[];
  id: string;
  p_id: string;
  loading: boolean;
  from: string;
  user: string;
  source: string;

  constructor(private route: ActivatedRoute, private booksService: OutingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.from = 'Bern';

    this.user = null;
    this.loading = true;
    this.connections = [];
    this.weathers = [];
    this.dangers = [];

    this.outing = new Outing();

    this.id = this.route.snapshot.params['id'];
    this.p_id = this.route.snapshot.params['p_id'];

    this.booksService.getRecoUser(this.p_id, data => {
      this.user = data['FNAME'] + ' ' + data['LNAME'];
      this.from = data['STATION'];
    });


    this.booksService.getAccess(this.from, this.id, access => {
      this.connections = access.pt_connections;
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
