import {Component, OnDestroy, OnInit} from '@angular/core';
import {OutingsService} from '../services/outings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Outing} from '../models/outing.model';
import {Subscription} from 'rxjs';
import {UsersService} from '../services/users.service';

@Component({
  selector: 'app-outing-list',
  templateUrl: './outing-list.component.html',
  styleUrls: ['./outing-list.component.scss']
})
export class OutingListComponent implements OnInit {

  p_id;
  outings: any[];
  user: String;
  station: String;

  constructor(private route: ActivatedRoute, private outingsService: OutingsService, private router: Router,
              private userService: UsersService) {
  }

  ngOnInit() {

    this.p_id = this.route.snapshot.params['p_id'];
    this.userService.saveToken(this.p_id);
    this.outings = [];


    this.outingsService.getRecoUser(this.p_id, data => {
      this.user = data['FNAME'] + ' ' + data['LNAME'];
      this.station = data['STATION'];
    });

    this.outingsService.getReco(this.p_id, data => {

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
    this.router.navigate(['/outings', this.p_id, id]);
  }
}
