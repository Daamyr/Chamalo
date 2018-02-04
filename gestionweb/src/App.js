import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapContainer from './MapContainer.js'
import {GoogleApiWrapper} from 'google-maps-react';
import SocketIO from 'socket.io-client';


// var SocketIO = require('nativescript-socket.io');
// let socketio = null;

class App extends Component {
  componentDidMount(){
    console.log("Hello" + this.socketio);
  }

  constructor(){
    super();
    this.socketio = null;
    this.name = "Chamalo";
    this.state = {
      page : "login",
      username : "",
      password : "",
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

  getPage = () => {
    return this.state.page;
  }

  handleChange = (event) => {
    this.setState({username: event.target.value});
  }

  handleChangePass = (event) => {
    this.setState({password: event.target.value});
  }

  setPage = (page) => {
    this.setState({ page })
  }

  changeLang = () => {
    if (this.state.selectedLang === "fr") {
      this.setState({ selectedLang: "en" })
    } else {
      this.setState({ selectedLang: "fr" })
    }
  }

  connect = () => {
    console.log("Connection request");
    try {
      if (this.socketio != null) {
        console.log("not null");
        this.socketio.emit("forceDisconnect");
        this.socketio = null;
      }


      this.socketio = SocketIO.connect('http://138.197.172.107:8081?token=prod&id=0&username='+ this.state.username +'&password='+ this.state.password);

      

      let vm = this;
      this.socketio.on('connectack',
        function(){
          console.log("Auth ok");
          vm.setPage("normal");//-----------------------------------------
        });

      this.socketio.on('notconnectack',
        function(){
          if (vm.state.selectedLang === "fr") {
          alert("Identifiants incorrects.");
        } else {
          alert("Wrong username or password.");
        }
        });

    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  render() {
    if(this.state.page === 'login') {
      console.log(this.socketio);
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">{this.state.lang[this.state.selectedLang].welcome}</h1>
            <button onClick={() => this.changeLang()}>{(this.state.selectedLang).toUpperCase()}</button>
          </header>
          <div id="connect">
            <div>
              <input id="username"
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
              placeholder={this.state.lang[this.state.selectedLang].username}
              />
              <br/>
              <input  id="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChangePass}
              placeholder={this.state.lang[this.state.selectedLang].password}
              />
              <br/>
              <button onClick={() => this.connect()}>{this.state.lang[this.state.selectedLang].connect}</button>
            </div>
          </div>
        </div>
        );
    }

    return (
      <div className="AppLog">
        <header className="AppLog-header">
          <h1 className="AppLog-title">Welcome to Chamalo</h1>
        </header>
        <MapContainer
          mySocket={this.socketio}
        />
      </div>
    );
  }
}


export default App;
