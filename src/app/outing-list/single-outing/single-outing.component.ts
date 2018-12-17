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
  danger_dates: string[];
  from_stations: string[];
  id: string;
  loading: boolean;

  constructor(private route: ActivatedRoute, private booksService: OutingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.outing = new Outing();
    this.id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(this.id,
      (book: Outing) => {
        this.outing = book;
        this.dangers = [];
        this.danger_dates = [];
        this.from_stations = [];
        Object.keys(book.dangers).forEach(danger => {
          this.danger_dates.push(danger);
          this.dangers.push(book.dangers[danger]);
        });
        this.from_stations = [];
        if (book.pt_connections !== undefined) {

          Object.keys(book.pt_connections).forEach(from => {
            this.from_stations.push(from);
          });
        }
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
