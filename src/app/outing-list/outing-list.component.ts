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

  outings: any[];
  user: object;
  station: string;
  loading: boolean;

  constructor(private route: ActivatedRoute, private outingsService: OutingsService, private router: Router,
              private userService: UsersService) {
  }

  ngOnInit() {

    const p_id = this.route.snapshot.queryParams['user'];
    this.loading = true;

    this.userService.userSubject.subscribe(user => {
      if (user !== this.user) {
        this.fetchForUser(user);
      }
    });

    if (p_id !== undefined) {
      this.userService.saveToken(p_id);
    } else {
      this.userService.emitUser();
    }


  }

  fetchForUser(user) {
    if (user !== null && user !== undefined) {

      this.user = user;
      this.outingsService.getRoutes(routes => {
        this.outings = routes;
        console.log(routes);
        this.loading = false;
      }, user['origin']);

    }


  }

  onNewBook() {
    this.router.navigate(['/outings', 'new']);
  }


  onViewBook(id: number) {
    this.router.navigate(['/outings', id]);
  }
}
