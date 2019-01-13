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
  id: string;
  loading: boolean;
  user: object;
  source: string;

  constructor(private route: ActivatedRoute, private booksService: OutingsService,
              private router: Router, private userService: UsersService) {
  }

  ngOnInit() {
    this.loading = true;

    this.outing = new Outing();

    this.id = this.route.snapshot.params['id'];
    const p_id = this.route.snapshot.queryParams['user'];

    this.userService.userSubject.subscribe(user => {
      this.loadForUser(user);
    });

    if (p_id !== undefined) {
      this.userService.getUserCB(p_id, (user) => {
        this.loadForUser(user);
      });
    }
  }


  loadForUser(user) {
    if (user !== null && user !== undefined) {
      this.user = user;
      this.booksService.getRoute(this.id, user).then(
        (book) => {
          this.outing = book;
          this.loading = false;
          const urls = this.outing.source.split('/');
          this.source = urls[urls.length - 1];
          this.source = 'https://www.camptocamp.org/routes/' + this.source;
        });


    }
  }


  update() {
    this.router.navigate(['/outings/update/' + this.id]);
  }

  onBack() {
    this.router.navigate(['/outings']);
  }
}
