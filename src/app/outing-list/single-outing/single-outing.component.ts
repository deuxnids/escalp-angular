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
  id: Number;

  constructor(private route: ActivatedRoute, private booksService: OutingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.outing = new Outing();
    this.id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+this.id,
      (book: Outing) => {
        this.outing = book;
      });
  }

  update() {
    this.router.navigate(['/outings/update/' + this.id]);
  }

  onBack() {
    this.router.navigate(['/outings']);
  }
}
