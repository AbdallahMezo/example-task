import React from 'react';
import L from 'leaflet';
import {Map, Marker, TileLayer, Tooltip} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

class MapComponent extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      name: 'Loading...',
      coordinates: [0, 0],
      clickedCoordinates: `Latlng of your click on map showed here ..`,
      markers: [],
      json: null,
    };
  }

  setMarkerInfo(marker){
    this.setState(({
      name: marker.properties.name,
      coordinates: marker.geometry.coordinates
    }))
  }

  getMarkers(rawData = this.state.json){
    const markers = [];
    rawData.forEach((marker, i) => {
      markers.push(
        <Marker position={marker.geometry.coordinates} key={i} onClick={() => this.setMarkerInfo(marker)}>
          <Tooltip>
            <p>{marker.properties.name}</p>
          </Tooltip>
        </Marker>
    )
    });
    console.log('== markers ==', markers);
    return markers;
  }

  getMapBounds() {
    const {json} = this.state;
    if (!json) {
      return;
    }
    const markersCoors = json.map(station => station.geometry.coordinates);
    const bounds = L.latLngBounds(markersCoors);
    return Object.keys(bounds).length ? bounds : null;
  };

  getCoors(e){
    console.log('== e ==', e);
    this.setState(({
      clickedCoordinates: `Your coordinates: lat:${e.latlng.lat}, lng:${e.latlng.lng}`,
    }));
  }

  componentDidMount() {
    fetch('http://localhost:3000/stations')
      .then(response => response.json())
      .then((json) => {
        console.log('=-= json[0] ==', json[0]);
        const { properties, geometry } = json[0];
        this.setState((({
          json:json,
          name:properties.name,
          coordinates: geometry.coordinates
        })));
    });
    // this.map = new L.Map('mapid');
    // const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    // const osm = new L.TileLayer(osmUrl, {
    //   minZoom: 8,
    //   maxZoom: 12,
    //   attribution,
    // });
    // this.map.setView(new L.LatLng(52.51, 13.40), 9);
    // this.map.addLayer(osm);
  }
  render() {
    const {name, coordinates, json, clickedCoordinates} = this.state;
    const center = json && json[0].geometry.coordinates;
    return (
      <React.Fragment>
      <div id="info">
      <p id="clickValue">{clickedCoordinates}</p>
      <p>Name: {name}</p>
        <p>Coordinates: lat: {coordinates[0]}, lng: {coordinates[1]}</p>
      </div>
      <Map
        id="mapid"
        center={center || [13.3454394, 52.5464403]}
        style={{height:'400'}}
        zoom={10}
        bounds={this.getMapBounds()}
        onClick={(e) => this.getCoors(e)}>
        <TileLayer
          attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MarkerClusterGroup showCoverageOnHover={false}>
          {json && this.getMarkers(json)}
        </MarkerClusterGroup>
      </Map>
    </React.Fragment>

        // <div>
        //   Name: {this.state.name}<br />
        //   {this.state.coordinates[1]} {this.state.coordinates[0]}
        //   <div id="mapid"></div>
        // </div>
      );
  }
};

export default MapComponent;
