import React from 'react';
import logo from './logo.svg';
import './App.css';

import * as spotify from './spotify';

class App extends React.Component {
  constructor() {
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>minify</h1>
          <div>Welcome to minify!!</div>
          <h2>User: {user}</h2>
          <button id="play">Play</button>
        </div>
        <script>
          document.querySelector('#play').addEventListener('click', playSong);
        </script>
      </div>
    );
  }
}

export default App;
