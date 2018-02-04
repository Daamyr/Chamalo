import React, { PropTypes, Component } from 'react';
import GoogleMap from 'google-map-react'
import './MapContainer.css';
import './React-Toggle.css';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Toggle from 'react-toggle';
// import defibData from './defibrillateurs.geojson';
import Geo from './Geo.js';

import MyGreatPlace from './my_great_place.jsx';

export default class MapContainer extends Component {
  componentWillMount () {

    }

  componentDidMount(){
    // var data = new Geo().Geo();
    // data.features.map((feature)=>
    //   this.state.listDefib.push({
    //                     name:'DEA',
    //                     address: feature.properties.Adresse,
    //                     coords:
    //                       {
    //                         lat: feature.geometry.coordinates[0],
    //                         lng: feature.geometry.coordinates[1]
    //                       }
    //                   }

    //     ));
    // console.log(this.state.listDefib);
    //console.log(defibData.features.map((feature)=>feature.geometry.coordinates[0]));
  }

  constructor(props){
    super(props);
    this.socketio = null;
    this.name = "LE NOM";
    this.state = {
      toggleClient: false,
      toggleDefib: false,
      toggle3: false,
      listClient: [ {id: 123, name: "Paul", coords: {lat: 46.545732, lng: -72.249542}},
                    {id: 111, name: "Bleu", coords: {lat: 46.545732, lng: -72.349542}},
                    {id: 444, name: "Noir", coords: {lat: 46.545732, lng: -72.149542}}
                    ],
      listDefib: [],
      page : "asd",
      selectedLang: "fr",
      lang: {
        fr: {
          connect: "Connexion",
          username: "Nom d'usager",
          password: "Mot de passe",
          welcome: "Bienvenue sur "+this.name
        },
        en: {
          connect: "Connection",
          username: "Username",
          password: "Password",
          welcome: "Welcome to "+this.name
        }
      }
    }
  }

  createMapOptions(maps) {
    return {
      gestureHandling: 'cooperative' // Will capture all touch events on the map towards map panning
    }
  }

  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    greatPlaceCoords: PropTypes.any
  };

  static defaultProps = {
    center: [46.545732, -72.449542],
    zoom: 9,
    greatPlaceCoords: {lat: 46.545732, lng: -72.449542}
  };

  shouldComponentUpdate = shouldPureComponentUpdate;


  

    // condition(){
    //   if(this.state.toggleDefib){
    //     return this.state.listDefib.map((item)=><MyGreatPlace key={item.id} lat={item.coords.lat} lng={item.coords.lng} text={item.name}/>)}
    //   }
    //   else{
    //     return {}
    //   }
    // }

  render() {


    var data = new Geo().Geo();
    data.features.map((feature)=>
      this.state.listDefib.push({
                        id: Math.random()*100,
                        name:'DEA',
                        address: feature.properties.Adresse,
                        coords:
                          {
                            lat: feature.geometry.coordinates[1],
                            lng: feature.geometry.coordinates[0]
                          }
                      }

        ));


    return (
        <div id="MapLog">
            <div id="MapLeft">
              <label>
                <ul>
                  {this.state.listClient.map((item)=><li key={item.id}>{item.name}</li>)}
                </ul>
              </label>
            </div>
            <div id="MapCenter">

              <GoogleMap
                apiKey={'AIzaSyDRWlV2IhcsdiMc8WPZE7m3JlQXiz4o9UI'} // set if you need stats etc ...
                center={this.props.center}
                zoom={this.props.zoom}>
                {this.state.listClient.map((item)=><MyGreatPlace key={item.id} lat={item.coords.lat} lng={item.coords.lng} text={item.name}/>)}

                {this.state.listDefib.map((item)=><MyGreatPlace key={item.id} lat={item.coords.lat} lng={item.coords.lng} text={item.name}/>)}
                 
                
              </GoogleMap>
                }

            </div>
            <div id="MapRight">
              <label>
              <Toggle
                defaultChecked={this.state.toggleClient}
                onChange={this.handleBaconChange} />
              <span id="Toggle">Clients</span>
              </label><br/>
              <label>
              <Toggle
                defaultChecked={this.state.toggleDefib}
                onChange={this.handleBaconChange} />
              <span id="Toggle">Defib</span>
              </label><br/>
              <label>
              <Toggle
                defaultChecked={this.state.toggleToggle3}
                onChange={this.handleBaconChange} />
              <span id="Toggle">Toggle3</span>
              </label>
            </div>
        </div>
      );
    }
  }

  // export default GoogleApiWrapper({
  //   apiKey: 'AIzaSyDRWlV2IhcsdiMc8WPZE7m3JlQXiz4o9UI'
  // })(MapContainer)
