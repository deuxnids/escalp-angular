import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {OutingsService} from '../services/outings.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit {

  ga = window['ga'];
  ol = window['ol'];
  map;
  features;
  data;
  @Input('id') id;


  constructor(private booksService: OutingsService) {
    this.data = {};
  }


  ngOnInit() {
    this.booksService.getGeo(this.id, geo => {
      this.draw(geo);
    });
  }

  draw(features) {

    this.features = (new this.ol.format.GeoJSON()).readFeatures(features);
    const layer = this.ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    const pt_layer = this.ga.layer.create('ch.bav.haltestellen-oev');

    const vectorLayer = new this.ol.layer.Vector({
      source: new this.ol.source.Vector({
        features: this.features
      }),
      style: styleFunction
    });
    const vectorLayerStops = new this.ol.layer.Vector({
      source: new this.ol.source.Vector({
        features: []
      }),
    });

    this.map = new this.ga.Map({
      target: 'map',
      layers: [layer, pt_layer, vectorLayer, vectorLayerStops],
      view: new this.ol.View({
        resolution: 100,
        center: [2670000, 1160000]
      })
    });

    const extent = vectorLayer.getSource().getExtent();
    this.map.getView().fit(extent, this.map.getSize());

  }

}


const styleFunction = function (feature) {
  const ol = window['ol'];


  const pt_style = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      //size: [52, 52],
      //offset: [52, 0],
      opacity: 1,
      scale: 0.05,
      src: 'assets/icone_bus_noir-01.png'
    })
  });


  const waypoint_style = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.0, 0.5],
      opacity: 1,
      scale: 0.2,
      src: 'assets/wp.png'
    })
  });


  const route_style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 4
    })
  });


  const styles = {
    'Point': [waypoint_style],
    'LineString': route_style,
    'MultiLineString': route_style
  };

  if (feature.getGeometry().getType() === 'LineString') {
    return route_style;
  }

  if (feature.getProperties()['type'] === 'wp') {
    return waypoint_style;
  }
  if (feature.getProperties()['type'] === 'pt') {
    return pt_style;
  }

  return styles[feature.getGeometry().getType()];
};


