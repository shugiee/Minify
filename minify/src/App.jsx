import React from 'react';
import logo from './logo.svg';
import './App.css';

import * as spotify from './spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: 'Hard Code Jonathan',
      access_token:
        'BQDuJywtIj1saIxiFQXMCxA8ojeD93jQyBVCFmXZYpZxRHKxYiz1k9n6yMmb-oXvV2_a2S1rQuzCL4PCe9Hu4S1nwG43z0NZ2eRZw5uwmmB1GtJfVrTNE9DLgWqRSfj_hR0tgneOKjIbIGX6x6OKzNiaojmKQkBX9oXLAieySR7QWk7EET5l5qU7isznu8L9KHXFWV0ovEp6TYkPnLUCV2N7m6Zng_jDggR-sLyKZvWDnhlo0WwqR6pbd-tm45R6Ybrow00N7gSmsZ1jIBim',
      refresh_token:
        'AQDL8m-MQ1EXzEi_e9EAtgO8fcQA8p8eDi1DgHHTxToaQLKwzwQ7LZD0jnee_1TftcMVLuIrCa-yAv7pFg4axKiwgu8F91yHV0giGtVT8y-qgisiuCXWUmdC7JlD1XsUkkk'
    };

    this.resume = this.resume.bind(this);
  }

  resume() {
    // resume playback
  }

  render() {
    const { user } = this.state;
    return (
      <div className="App">
        <div className="container">
          <h1>minify</h1>
          <div>Welcome to minify!!</div>
          <h2>User: {user}</h2>
          <p>Access token: {this.state.access_token}</p>
          <p>Refresh token: {this.state.refresh_token}</p>
          <button id="resume" onClick={this.resume} className="btn btn-primary">
            resume
          </button>
        </div>
      </div>
    );
  }
}

export default App;
