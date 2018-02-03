import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {GoogleApiWrapper} from 'google-maps-react';

class App extends Component {
  // componentDidMount(){
  //   let map = new window.google.maps.Map(document.getElementById('map'),{
  //     center: {lat: -33.8688, lng: 151.2195},
  //     mapTypeControl: true,
  //     zoom : 15,
  //     mapTypeId: 'roadmap'
  //   });
  // }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h3>allo dans le render</h3>
        <div id="map" />
      </div>
    );
  }
}

export default App;

