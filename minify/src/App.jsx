import React from 'react';
import logo from './logo.svg';
import $ from 'jquery';
import './App.css';
import * as helperJS from './helperJS';
import * as _ from 'lodash';
import { access } from 'fs';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: 'Hard Code Jonathan',
      access_token:
        'BQBeTr9b3iUHIbLppJJt9xJTchUkziSJCZtFJ4uWcM__QUwQjS4nMjSgVzqbjl7Ve36A1_4pDR_IMtfTWxlfX3YcaSkJxHw4J3TBQOcfrMbSrN2A8n5ZrSAn-GeKUnkLoaP9qR5gsn3oU9Ognsc14lA0YmQepMk1lMi38Z14H6o5qMr3Ol2SypKC499lIkE5jUAKo_9iep4AUqUZLOHsg-jisspLYBX1NZDBHtOqjzIiEqADCJftxo2MmeCrU5YIqs4hzRPkeexd',
      refresh_token:
        'AQDL8m-MQ1EXzEi_e9EAtgO8fcQA8p8eDi1DgHHTxToaQLKwzwQ7LZD0jnee_1TftcMVLuIrCa-yAv7pFg4axKiwgu8F91yHV0giGtVT8y-qgisiuCXWUmdC7JlD1XsUkkk',
      item: '',
      is_playing: '',
      progress_ms: 0,
      query: '',
      queryResults: { tracks: {} }
    };

    this.setState = this.setState.bind(this);
    this.login = this.login.bind(this);
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.seek = this.seek.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.seekNext = this.seekNext.bind(this);
    this.seekPrevious = this.seekPrevious.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.getNewAccessToken = this.getNewAccessToken.bind(this);

    this.seekThrottle = _.throttle(this.seek, 500);
    this.searchSpotifyThrottle = _.throttle(this.searchSpotify, 1000);
  }

  componentDidMount() {
    // if user just logged in, get their access_token from the url
    const tokens = helperJS.getUrlVars();
    if (tokens.access_token && tokens.refresh_token) {
      this.setState(
        {
          isAuthenticated: true,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        },
        () => {
          // get current song
          this.getCurrentlyPlaying();
        }
      );
    }
  }

  login() {
    $.ajax({
      url: '/login',
      type: 'GET',
      error: err => {
        console.log(err);
      },
      success: xhr => {
        console.log('SUCCESS', xhr);
        this.setState(
          {
            isAuthenticated: true
          }
          // () => {
          //   res.redirect('http://localhost:3000');
          // }
        );
      }
    });
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
        this.setState(
          {
            item: data.item,
            is_playing: JSON.stringify(data.is_playing),
            progress_ms: data.progress_ms
          },
          () => {
            console.log(this.state);
          }
        );
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
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/pause',
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

  seek() {
    const value = this.state.progress_ms;
    console.log('seeking:', value);
    // seek/scrub to part of song
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/seek?position_ms=${value}`,
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

  handleSliderChange(event) {
    this.setState({ progress_ms: event.target.value }, this.seekThrottle);
  }

  seekNext() {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/next',
      type: 'POST',
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

  seekPrevious() {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/previous',
      type: 'POST',
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

  searchSpotify() {
    const { query } = this.state;
    const joinedQuery = query.replace(' ', '%20') + '&type=track';
    $.ajax({
      url: `https://api.spotify.com/v1/search?q=${joinedQuery}`,
      type: 'GET',
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
      success: data => {
        console.log(data);
        this.setState({ queryResults: data });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  handleQueryChange(event) {
    this.setState({ query: event.target.value }, this.searchSpotifyThrottle);
  }

  // using the refresh token, get a new access token (I believe they last an hour)
  getNewAccessToken() {
    $.ajax({
      url: '/refresh_token',
      type: 'GET',
      data: {
        refresh_token: this.state.refresh_token
      },
      error: err => {
        console.log(err);
      }
    }).done(data => {
      this.setState({
        access_token: data.access_token
      });
    });
  }

  render() {
    const { user, queryResults } = this.state;
    const song = this.state.item || {};
    queryResults.tracks.items = queryResults.tracks.items || [];
    if (this.state.isAuthenticated) {
      return (
        <div className='App'>
          <div className='container'>
            <h1>minify</h1>
            <div>Welcome to minify!!</div>
            <h2>User: {user}</h2>
            <button
              id='currently playing'
              onClick={this.getCurrentlyPlaying}
              className='btn btn-primary'
            >
              Get Current song
            </button>
            <button
              id='resume'
              onClick={this.resume}
              className='btn btn-primary'
            >
              resume
            </button>
            <button id='pause' onClick={this.pause} className='btn btn-primary'>
              pause
            </button>
            <button
              id='next'
              onClick={this.seekNext}
              className='btn btn-primary'
            >
              next
            </button>
            <button
              id='previous'
              onClick={this.seekPrevious}
              className='btn btn-primary'
            >
              previous
            </button>
            <button
              className='btn btn-default'
              id='obtain-new-token'
              onClick={this.getNewAccessToken}
            >
              Refresh Token
            </button>
            <button
              id='seek'
              onClick={() => {
                this.setState({ progress_ms: 25000 }, this.seek);
              }}
              className='btn btn-primary'
            >
              seek 25000
            </button>
            <input
              type='range'
              value={this.state.progress_ms}
              onChange={this.handleSliderChange}
              max={song.duration_ms || 0}
            />
            <input
              type='text'
              id='song-search'
              value={this.state.query}
              onChange={this.handleQueryChange}
            />
            <div>
              {console.log(queryResults.tracks)}
              {queryResults.tracks.items.map(song => {
                return (
                  <div className='search-result'>
                    <p>Song Name: {song.name}</p>
                    <p>
                      Artist:{' '}
                      {song.artists
                        .map(artist => {
                          return artist.name;
                        })
                        .join(' & ')}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* <p>item: {this.state.item}</p>
          <p>is_playing {this.state.is_playing}</p>
          <p>progress_ms: {this.state.progress_ms}</p> */}
          </div>
        </div>
      );
    } else {
      return (
        <div className='container'>
          <div id='login'>
            <h1>Welcome to minify! Please login to Spotify below</h1>
            <a href='http://localhost:8888/login' className='btn btn-primary'>
              Log in with Spotify
            </a>
          </div>
          <div id='loggedin'>
            <div id='user-profile'></div>
            <div id='oauth'></div>
          </div>
        </div>
      );
    }
  }
}

export default App;
