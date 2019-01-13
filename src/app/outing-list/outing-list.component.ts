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

  outings;
  filtered_outings;
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
      this.userService.getUserCB(p_id, (user) => {
        this.fetchForUser(user);
      });
    } else {
      if (this.userService.user !== null) {
        this.fetchForUser(this.userService.user);
      }
    }


  }

  fetchForUser(user) {
    if (user !== null && user !== undefined) {

      this.user = user;
      this.outingsService.getRoutesByAccessibility(user, 'pt_duration').then(routes => {
        this.outings = routes;
        this.filtered_outings = routes.filter(r => !r.hide);
        this.loading = false;

      });

    }


  }

  filterBy(value) {
    switch (value) {
      case 'hide':
        this.filtered_outings = this.outings.filter(r => r.hide);
        break;

      case 'todo':
        this.filtered_outings = this.outings.filter(r => r.todo);
        break;
      case 'none':
        this.filtered_outings = this.outings.filter(r => !r.hide);
        break;

    }

  }

  sortBy(value) {
    this.outings = [];
    switch (value) {
      case 'car':
        this.outingsService.getRoutesByAccessibility(this.user, 'car_duration').then(routes => {
          this.setRoutes(routes);
        });
        break;
      case 'pt':
        this.outingsService.getRoutesByAccessibility(this.user, 'pt_duration').then(routes => {
          this.setRoutes(routes);
        });
        break;
      case 'den':
        this.outingsService.getRoutesBy(this.user, 'height_diff_up', false).then(routes => {
          this.setRoutes(routes);
        });
        break;
      case 'altitude_min':
        this.outingsService.getRoutesBy(this.user, 'elevation_min', false).then(routes => {
          this.setRoutes(routes);
        });
        break;
      case 'altitude_max':
        this.outingsService.getRoutesBy(this.user, 'elevation_max', false).then(routes => {
          this.setRoutes(routes);
        });
        break;

    }

  }

  setRoutes(routes) {
    this.outings = routes;
    this.filtered_outings = routes.filter(r => !r.hide);

  }

  toDo(route, value) {
    this.userService.setToDo(route.uid, value);
    route.todo = value;
  }

  setHide(route, value) {
    this.userService.setHIde(route.uid, value);
    //this.filtered_outings.splice(this.filtered_outings.indexOf(route), 1);
    route.hide = value;
  }

  onNewBook() {
    this.router.navigate(['/outings', 'new']);
  }


  onViewBook(id: number) {
    this.router.navigate(['/outings', id]);
  }
}
