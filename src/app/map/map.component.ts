import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {OutingsService} from '../services/outings.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit, AfterViewInit {

  ga = window['ga'];
  ol = window['ol'];
  map;
  features;
  data;
  @Input('with_pt_layer') with_pt_layer: boolean;
  @Input('id') id;


  constructor(private booksService: OutingsService) {
    this.data = {};
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.booksService.getGeo(this.id, geo => {
      this.draw(geo);
    });
  }

  draw(features) {

    this.features = (new this.ol.format.GeoJSON()).readFeatures(features);
    const layer = this.ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    const pt_layer = this.ga.layer.create('ch.bav.haltestellen-oev');
    const slopes = this.ga.layer.create('ch.swisstopo-karto.hangneigung');

    // 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo-karto.skitouren/default/current/3857/{z}/{x}/{y}.png'
    const ski_layer = getLayer();

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

    const layers = [layer];
    if (this.with_pt_layer) {
      layers.push(pt_layer);
    }
    layers.push(vectorLayer);
    layers.push(vectorLayerStops);
    layers.push(slopes);
    layers.push(ski_layer);


    this.map = new this.ga.Map({
      target: 'map-' + this.id,
      layers: layers,
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


const getLayer = function () {

  const ol = window['ol'];

  // The ol.layer


  const RESOLUTIONS = [
    4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
    1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5
  ];
  const extent = [2420000, 130000, 2900000, 1350000];
  const projection = ol.proj.get('EPSG:2056');
  projection.setExtent(extent);


  const matrixIds = [];
  for (let i = 0; i < RESOLUTIONS.length; i++) {
    matrixIds.push(i);
  }


  const tileGrid = new ol.tilegrid.WMTS({
    origin: [extent[0], extent[3]],
    resolutions: RESOLUTIONS,
    matrixIds: matrixIds
  });

  const ski_layer = new ol.layer.Tile({
    source: new ol.source.WMTS({
      attributions: [new ol.Attribution({
        html: '&copy; ' +
        '<a href="http://www.geo.admin.ch/internet/geoportal/' +
        'en/home.html">' +
        'geo.admin.ch</a>'
      })],
      url: 'https://wmts.geo.admin.ch/1.0.0/{Layer}/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.png',
      tileGrid: tileGrid,
      layer: 'ch.swisstopo-karto.skitouren',
      requestEncoding: 'REST',
      projection: projection,
    }),
    opacity: 1.0
  });

  return ski_layer;

};
