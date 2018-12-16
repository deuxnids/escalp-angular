import {Component, Input, OnChanges, OnInit} from '@angular/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit, OnChanges {

  ga = window['ga'];
  ol = window['ol'];
  map;
  features;
  data;
  data2;
  @Input('geojson') geojson;


  constructor() {
    this.data = {};
  }


  ngOnChanges() {
    if (this.geojson !== undefined) {
      this.draw(this.geojson);
    }
  }

  draw(features) {

    this.features = (new this.ol.format.GeoJSON()).readFeatures(features);
    const layer = this.ga.layer.create('ch.swisstopo.pixelkarte-farbe');

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
      layers: [layer, vectorLayer, vectorLayerStops],
      view: new this.ol.View({
        resolution: 100,
        center: [2670000, 1160000]
      })
    });

    const extent = this.features[0].getGeometry().getExtent();
    this.map.getView().fit(extent, this.map.getSize());

  }

  ngOnInit() {
    //const data = JSON.parse(this.data);
  }
}


const styleFunction = function (feature) {
  const ol = window['ol'];

  const styles = {

    'Point': [new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: 'blue'
        })
      })
    })],

    'LineString': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'green',
        width: 10
      })
    }),
    'MultiLineString': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 10
      })
    })
  };

  return styles[feature.getGeometry().getType()];
};

