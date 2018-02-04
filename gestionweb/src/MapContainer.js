import React, { PropTypes, Component } from 'react';
import GoogleMap from 'google-map-react'
import './MapContainer.css';
import './React-Toggle.css';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Toggle from 'react-toggle'

import MyGreatPlace from './my_great_place.jsx';

export default class MapContainer extends Component {
  componentWillMount () {

    }

  componentDidMount(){

  }

  constructor(props){
    super(props);
    this.socketio = null;
    this.name = "LE NOM";
    this.state = {
      toggleClient: false,
      toggleDefib: false,
      toggle3: false,
      listClient: [{id: 123, name: "Paul"}, {id: 111, name: "Bleu"}],
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
    center: [59.938043, 30.337157],
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };

  shouldComponentUpdate = shouldPureComponentUpdate;


  render() {


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
                // apiKey={YOUR_GOOGLE_MAP_API_KEY} // set if you need stats etc ...
                center={this.props.center}
                zoom={this.props.zoom}>
                <MyGreatPlace lat={59.955413} lng={30.337844} text={'A'} /* Kreyser Avrora */ />
                <MyGreatPlace {...this.props.greatPlaceCoords} text={'B'} /* road circle */ />
              </GoogleMap>

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
