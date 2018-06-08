import React from 'react';
import L from 'leaflet';
class MapComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: 'Loading...',
      coordinates: [0, 0],
      distance: 'Click on map first!'
    };
  }
  componentWillMount() {

  }

  handleClick(e){
    fetch(`http://localhost:3000?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    .then(response => response.json())
    .then(json => {
      const { properties, geometry, distance } = json;
        this.setState({
          name: properties.name,
          coordinates: geometry.coordinates,
          distance: distance,
        });
    })
  }
  componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then((json) => {
        const { properties, geometry, distance } = json;
        this.setState({
          name: properties.name,
          coordinates: geometry.coordinates,
          distance:distance
        });
      })
      .then( () => {
        this.map = new L.Map('mapid');
        const {name, coordinates} = this.state;
        const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        const osm = new L.TileLayer(osmUrl, {
          minZoom: 8,
          maxZoom: 12,
          attribution,
        });
        const center = coordinates || new L.LatLng(52.51, 13.40);
        this.map.setView(center, 10);
        this.map.addLayer(osm);
        this.map.addEventListener('click', (e) => {
          this.handleClick(e);
        })
        console.log(' ==== ', coordinates)
        this.marker = new L.marker(coordinates).addTo(this.map);
        this.marker.bindTooltip(name);
      })
  }
  componentWillUpdate(nextProps, nextState){
    if((this.state.coordinates[0] !== nextState.coordinates[0]) && this.marker){
      this.marker.setLatLng(nextState.coordinates);
      this.marker.bindTooltip(nextState.name);
    }
  }
  render() {
    const {name, coordinates, distance} = this.state;
    return (
        <React.Fragment>
          <div id="info">
            <p>Distance in Meters: {distance} </p>
            <p>Name: {name}</p>
            <p>lat: {coordinates[1]}, lng: {coordinates[0]}</p>
          </div>
          <div id="mapid"></div>
        </React.Fragment>
      );
  }
};

export default MapComponent;
