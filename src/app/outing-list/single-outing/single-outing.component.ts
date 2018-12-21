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
  loading: boolean;
  from: string;
  user: string;

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
    if (this.route.snapshot.queryParamMap.has('from')) {
      this.from = this.route.snapshot.queryParams['from'];
    }

    if (this.route.snapshot.queryParamMap.has('user')) {
      this.user = this.route.snapshot.queryParams['user'];
    }


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
      });
  }

  update() {
    this.router.navigate(['/outings/update/' + this.id]);
  }

  onBack() {
    this.router.navigate(['/outings']);
  }
}
