import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
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
    this.state = {
      page : "login",
      username : "",
      password : "",
    }
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

  connect = () => {
    console.log("Connection request");
    try {
      if (this.socketio != null) {
        console.log("not null");
        this.socketio.emit("forceDisconnect");
        this.socketio = null;
      }

      this.socketio = SocketIO.connect('http://138.197.172.107:8081?token=prod&id=0&username='+ this.state.username +'&password='+ this.state.password);

      this.socketio.on('gestion:coords',
        function (data){
          let latitude = data.Latitude;
          let longitude = data.Longitude;
          let speed = data.Speed;
          let direction = data.Direction;
          let timestamp = data.TimeStamp;
          console.log(latitude + " " + longitude + " " + speed + " " + direction + " " + timestamp);
        });

      let vm = this;
      this.socketio.on('connectack',
        function(){
          console.log("Auth ok");
          vm.setPage("normal");//-----------------------------------------
        });
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  test() {
    if(!this.socketio.connected) {
      alert("you're not connected");
    } else {
    this.socketio.emit("test", {"connection":{"prenom":"Maxime", "nom":"Damour"}});
    }
  }

  render() {
    if(this.state.page === 'login') {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <input id="username"
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
          />
          <input  id="password"
          type="password"
          value={this.state.password}
          onChange={this.handleChangePass}
          />
          <button onClick={() => this.connect()}>Connection</button>
        </div>
        );
    }


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
      <button onClick={() => this.connect()}>Connection</button>
      <button onClick={() => this.test()}>test</button>
      </div>
    );
  }
}

export default App;
