import {Component, OnDestroy, OnInit} from '@angular/core';
import {OutingsService} from '../services/outings.service';
import {Router} from '@angular/router';
import {Outing} from '../models/outing.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-outing-list',
  templateUrl: './outing-list.component.html',
  styleUrls: ['./outing-list.component.scss']
})
export class OutingListComponent implements OnInit {

  outings: any[];
  outingsSubscription: Subscription;

  constructor(private outingsService: OutingsService, private router: Router) {
  }

  ngOnInit() {
    this.outings = [];
    this.outingsService.getReco('fdc0250bbb251d504e7d2e4457750e6a', data => {
      Object.keys(data).forEach(d => {
        this.outingsService.getSingleBook(data[d]['route'], route => {
          route.uid = data[d]['route'];
          route.score = data[d]['score'];
          this.outings.push(route);
          this.outings = this.outings.sort((a, b) => (a.score < b.score) ? 1 : -1);

        });
      });
    });

  }

  onNewBook() {
    this.router.navigate(['/outings', 'new']);
  }


  onViewBook(id: number) {
    this.router.navigate(['/outings', 'view', id]);
  }
}
