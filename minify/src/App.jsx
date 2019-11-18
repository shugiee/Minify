import React from 'react';
import logo from './logo.svg';
import $ from 'jquery';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: 'Hard Code Jonathan',
      access_token:
        'BQBeTr9b3iUHIbLppJJt9xJTchUkziSJCZtFJ4uWcM__QUwQjS4nMjSgVzqbjl7Ve36A1_4pDR_IMtfTWxlfX3YcaSkJxHw4J3TBQOcfrMbSrN2A8n5ZrSAn-GeKUnkLoaP9qR5gsn3oU9Ognsc14lA0YmQepMk1lMi38Z14H6o5qMr3Ol2SypKC499lIkE5jUAKo_9iep4AUqUZLOHsg-jisspLYBX1NZDBHtOqjzIiEqADCJftxo2MmeCrU5YIqs4hzRPkeexd',
      refresh_token:
        'AQDL8m-MQ1EXzEi_e9EAtgO8fcQA8p8eDi1DgHHTxToaQLKwzwQ7LZD0jnee_1TftcMVLuIrCa-yAv7pFg4axKiwgu8F91yHV0giGtVT8y-qgisiuCXWUmdC7JlD1XsUkkk',
      item: '',
      is_playing: '',
      progress_ms: 0
    };

    this.resume = this.resume.bind(this);
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  getCurrentlyPlaying() {
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player',
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader(
          'Authorization',
          'Bearer ' + this.state.access_token
        );
      },
      success: data => {
        this.setState({
          item: JSON.stringify(data.item),
          is_playing: JSON.stringify(data.is_playing),
          progress_ms: JSON.stringify(data.progress_ms)
        });
      }
    });
  }

  resume() {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/play',
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      beforeSend: xhr => {
        xhr.setRequestHeader(
          'Authorization',
          'Bearer ' + this.state.access_token
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }

  pause() {
    // pause playback
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
          <button
            id="currently playing"
            onClick={this.getCurrentlyPlaying}
            className="btn btn-primary"
          >
            Get Current song
          </button>
          <button id="resume" onClick={this.resume} className="btn btn-primary">
            resume
          </button>
          <p>item: {this.state.item}</p>
          <p>is_playing {this.state.is_playing}</p>
          <p>progress_ms: {this.state.progress_ms}</p>
        </div>
      </div>
    );
  }
}

export default App;
