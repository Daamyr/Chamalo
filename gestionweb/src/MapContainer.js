import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {

  createMapOptions(maps) {
    console.log("allo");
  return {
    gestureHandling: 'cooperative' // Will capture all touch events on the map towards map panning
  }
}

render() {
    return (
      <Map 
        google={this.props.google}
        zoom={10}
      	initialCenter={{
            lat: 46.545732,
            lng: -72.749542
          }}
          scrollwheel={false}
          // gestureHandling="none"
        >
 
        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
 
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>allo</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDRWlV2IhcsdiMc8WPZE7m3JlQXiz4o9UI'
})(MapContainer)