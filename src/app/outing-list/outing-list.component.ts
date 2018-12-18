import { Component, OnDestroy, OnInit } from '@angular/core';
import { OutingsService } from '../services/outings.service';
import { Router } from '@angular/router';
import {Outing} from '../models/outing.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-outing-list',
  templateUrl: './outing-list.component.html',
  styleUrls: ['./outing-list.component.scss']
})
export class OutingListComponent implements OnInit {

  outings: Outing[];
  outingsSubscription: Subscription;

  constructor(private outingsService: OutingsService, private router: Router) {
  }

  ngOnInit() {
    this.outingsService.getOutings(10, (outings: Outing[]) => {
      this.outings = outings;
    });
  }

  onNewBook() {
    this.router.navigate(['/outings', 'new']);
  }


  onViewBook(id: number) {
    this.router.navigate(['/outings', 'view', id]);
  }
}
