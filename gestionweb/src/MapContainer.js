import React, { PropTypes, Component } from 'react';
import GoogleMap from 'google-map-react'
import './MapContainer.css';
import './React-Toggle.css';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Toggle from 'react-toggle';
// import defibData from './defibrillateurs.geojson';
import Geo from './Geo.js';

import MyGreatPlace from './my_great_place.jsx';
import OurGreatPlace from './our_great_place.jsx';

let num = 0;

export default class MapContainer extends Component {
  componentWillMount () {

  }

  componentDidMount(){
    let vm = this;
    this.socketio.on('gestion:coords',
    function (data){
      for (let client of data) {
        let id = client.id;
        let name = client.name;
        let latitude = client.latitude;
        let longitude = client.longitude;
        let speed = client.speed;
        let direction = client.direction;
        let timestamp = client.timestamp;
        console.log(latitude + " " + longitude + " " + speed + " " + direction + " " + timestamp);
      }
      if (data.length > 0) {
        console.log("Receiving coords");
        vm.setState({listClient: data});
      } else {
        console.log("Receiving nothing "+num);
        num++;
        vm.setState({listClient: []});
      }

    });

    this.socketio.on('gestion:danger',
    function (data){
      console.log("Receiving ALERT");
      for (let client of vm.state.listClient) {
        if (client.name === data.name) {
          console.log(client.name);
          let id = client.id;
          let name = client.name;
          let latitude = client.latitude;
          let longitude = client.longitude;
          let speed = client.speed;
          let direction = client.direction;
          let timestamp = client.timestamp;
          client.danger = data.danger;
          console.log(latitude + " " + longitude + " " + speed + " " + direction + " " + timestamp);
        }
      }
      vm.setState({listClient: data});
    });
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
    this.socketio = props.mySocket;
    this.name = "LE NOM";
    this.state = {
      toggleClient: true,
      toggleDefib: true,
      listClient: [ {id: 123, name: "Paul", coords: {lat: 46.545732, lng: -72.249542}},
                    {id: 111, name: "Bleu", coords: {lat: 46.545732, lng: -72.349542}},
                    {id: 444, name: "Noir", coords: {lat: 46.545732, lng: -72.149542}}
                    ],
      listDefib: [],
      listPoI: [],
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

    componentDidUpdate(prevProps) {
    const { maps } = this.props

    // if (maps.mapInstance !== prevProps.maps.mapInstance) {
    //   if (this.marker) {
    //     this.marker.setMap(null)
    //   }
    //   this.renderMarker()
    // }

    // Update marker visibiliy
    if (this.marker && this.props.visible !== this.marker.visible) {
      this.marker.setMap(null)
      this.renderMarker()
    }
  }

  handleBaconChange = (event) => {
    this.setState({toggleClient: !this.state.toggleClient});
  }

  handleBaconChangeDefib = (event) => {
    this.setState({toggleDefib: !this.state.toggleDefib});
  }


  dropdown = () => {
    let whtml = [];
    for (let client of this.state.listClient) {
      whtml.push(<div id="dropdown"><button id="dropbtn">{client.name}</button><div id="dropdown-content"><a href="#">Latitude: {client.coords.lat}</a><a href="#">Longitude: {client.coords.lng}</a></div></div>);
      whtml.push(<br/>)
    }
    console.dir(whtml);
    return whtml;
  }

  render() {


    var data = new Geo().DEAGeo();
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
    // var data = new Geo().PoIGeo();
    // data.features.map((feature)=>
    //   this.state.listPoI.push({
    //                     id: Math.random()*200,
    //                     description:'point of interest',
    //                     class:feature.properties.fclass,
    //                     name:feature.properties.name,
    //                     address: feature.properties.Adresse,
    //                     coords:
    //                       {
    //                         lat: feature.geometry.coordinates[1],
    //                         lng: feature.geometry.coordinates[0]
    //                       }
    //                   }
    //
    //   ));


    return (
        <div id="MapLog">
            <div id="MapLeft">
              {this.dropdown()}
            </div>
            <div id="MapCenter">

              <GoogleMap
                apiKey={'AIzaSyDRWlV2IhcsdiMc8WPZE7m3JlQXiz4o9UI'} // set if you need stats etc ...
                center={this.props.center}
                zoom={this.props.zoom}>

                {this.state.toggleClient ? (
                  this.state.listClient.map((item)=><OurGreatPlace key={item.id} lat={item.coords.lat} lng={item.coords.lng} text={item.name} danger={item.danger}/>)
                ) : (
                  <p></p>
                )}
                {}

                {this.state.toggleDefib ? (
                  this.state.listDefib.map((item)=><MyGreatPlace key={item.id} lat={item.coords.lat} lng={item.coords.lng} text={item.name} danger={item.danger}/>)
                ) : (
                  <p></p>
                )}
                {}

                {/* {this.state.listPoI.map((item)=><MyGreatPlace key={item.id} lat={item.coords.lat} lng={item.coords.lng} text={item.name}/>)} */}
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
                onChange={this.handleBaconChangeDefib} />
              <span id="Toggle">Defib</span>
              </label>
            </div>
        </div>
      );
    }
  }

  // export default GoogleApiWrapper({
  //   apiKey: 'AIzaSyDRWlV2IhcsdiMc8WPZE7m3JlQXiz4o9UI'
  // })(MapContainer)
