import {Component, OnInit} from '@angular/core';
import {OutingsService} from '../services/outings.service';
import {Router} from '@angular/router';
import {WeatherService} from '../services/weather.service';
import {TransportsService} from '../services/transports.service';
import {PlannerService} from '../services/planner.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {


  data;

  constructor(private weatherService: WeatherService, private  transportsService: TransportsService, private planner: PlannerService) {
  }

  ngOnInit() {
    this.transportsService.fetch('Sion', 'Sierre', '23:00').subscribe(x => {
      console.log(x);
      this.data = x.connections[0];
    });
    //console.log(this.weatherService.forecast(11));

  }

}
