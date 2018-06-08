const express = require('express')
const app = express()

const fuelStations = require('./fuelstations.json').features;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function toRad(Value)
{
    return Value * Math.PI / 180;
}
/**
 * haversine formula
 * lat1, lon1, lat2, lon2 integers
 * returns distance in km
 */
 function calcCrow(lat1, lon1, lat2, lon2)
 {
   var R = 6371; // km
   var dLat = toRad(lat2-lat1);
   var dLon = toRad(lon2-lon1);
   var lat1 = toRad(lat1);
   var lat2 = toRad(lat2);

   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
     Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   var d = R * c;
   return d;
 }

app.get('/', (req, res) => {
  // TODO implement first server.
  console.log('sending');
  res.send(fuelStations[0])
})
app.get('/nearest', (req, res) => {
  const {query : {lat, lng}} = req;
  let nearest = fuelStations[0];
  let nearestDistance = 2000000;
  if(lat && lng){
    nearest = fuelStations.reduce((accum, station) => {
      const distance = calcCrow(lat, lng, station.geometry.coordinates[0], station.geometry.coordinates[1])*1000
      if (distance < nearestDistance ) {
        nearestDistance = distance;
        accum = station
      }
      return accum;
    }, {})
  }
  nearest.distance = Math.round(nearestDistance *100) / 100;
  res.send(nearest)
})
app.get('/stations', (req, res) => {
  // TODO implement first server.
  console.log('sending');
  res.send(fuelStations)
})
app.listen(3000, () => console.log('Example app listening on port 3000!'))
