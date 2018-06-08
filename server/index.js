const express = require('express')
const app = express()

const fuelStations = require('./fuelstations.json').features;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  // TODO implement first server.
  console.log('sending');
  res.send(fuelStations[0])
})
app.get('/nearest', (req, res) => {
  // TODO implement first server.
  // const {query} = req;
  // const nearestStationIndex = Math.min(fuelStations.find(station => {
  //   return [
  //     Math.abs(station.geometry.coordinates[0] - query.lat),
  //     Math.abs(station.geometry.coordinates[1] - query.lng)
  //   ]
  // }));

  console.log('query', query);
  console.log('== [nearestStationIndex] ==', nearestStationIndex);
})
app.get('/stations', (req, res) => {
  // TODO implement first server.
  console.log('sending');
  res.send(fuelStations)
})
app.listen(3000, () => console.log('Example app listening on port 3000!'))
