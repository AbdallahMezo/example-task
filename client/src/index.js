import React from "react";
import ReactDOM from "react-dom";
import MapComponent from './map_component';

const Index = () => {
  return (
    <div>
      <MapComponent />
    </div>);
};

ReactDOM.render(<Index />, document.getElementById("index"));
