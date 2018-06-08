import React from 'react';
import L from 'leaflet';
import {Map, Marker, TileLayer, Tooltip} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

class MapComponent extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      marker: {
        name: 'Loading...',
        coordinates: [0, 0],
      },
      nearest: {
        name: 'click to get nearest...',
        coordinates: [0, 0],
      },
      json: null,
      center: [13.3454394, 52.5464403],
      zoom: 8,
    };
  }

  setMarkerInfo(marker){
    this.setState(({
      marker: {
        name: marker.properties.name,
        coordinates: marker.geometry.coordinates,
      },
      center: marker.geometry.coordinates,
      zoom: 15,
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

  updateWithNearest(e){
    fetch(`http://localhost:3000/nearest?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    .then(response => response.json())
    .then(json => {
      const { properties, geometry, distance } = json;
        this.setState({
          nearest:{
            name: properties.name,
            coordinates: geometry.coordinates,
          },
          distance: distance,
          center: geometry.coordinates,
          zoom: 15,
        });
    })
    // TODO:
    // Change marker icon
  }

  componentDidMount() {
    fetch('http://localhost:3000/stations')
      .then(response => response.json())
      .then((json) => {
        console.log('=-= json[0] ==', json[0]);
        const { properties, geometry } = json[0];
        this.setState((({
          marker: {
            name:properties.name,
            coordinates: geometry.coordinates,
          },
          json:json,
          zoom: 10,
        })));
    });
  }
  render() {
    const {
      marker: {
        name,
        coordinates,
      },
      json,
      center,
      zoom,
      nearest: {
        name: nearestName,
        coordinates: nearestCoordinates
      },
      distance,
    } = this.state;
    return (
        <React.Fragment>
          <div id="info">
            <div id='nearestInfo'>
              <p id="nearest">Nearest station in: {distance} meters</p>
              <p>Name: {nearestName}</p>
              <p>Coordinates: lat: {nearestCoordinates[0]}, lng: {nearestCoordinates[1]}</p>
            </div>
            <p>Station info</p>
            <p>Name: {name}</p>
            <p>Coordinates: lat: {coordinates[0]}, lng: {coordinates[1]}</p>
          </div>
          <Map
            id="mapid"
            center={center}
            animation={true}
            zoom={zoom}
            bounds={this.getMapBounds()}
            onClick={(e) => this.updateWithNearest(e)}>
            <TileLayer
              attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <MarkerClusterGroup showCoverageOnHover={false}>
              {json && this.getMarkers(json)}
            </MarkerClusterGroup>
          </Map>
       </React.Fragment>
    );
  }
};

export default MapComponent;
