import React from 'react';
import $ from 'jquery';
import './App.css';
import PlayPause from './PlayPause.jsx';
import Like from './Like.jsx';
import PlaybackSlider from './PlaybackSlider.jsx';
import Shuffle from './Shuffle.jsx';
import Repeat from './Repeat.jsx';
import SearchBar from './SearchBar.jsx';
import SearchResult from './SearchResult.jsx';
import * as helperJS from './helperJS';
import _ from 'lodash';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playState: {
        device: { is_active: false },
        item: { album: { images: ['', '', ''], artists: [] } },
        progress_ms: 0,
        duration_ms: 0
      },
      isAuthenticated: false,
      // user: 'Hard Code Jonathan',
      access_token:
        'BQBeTr9b3iUHIbLppJJt9xJTchUkziSJCZtFJ4uWcM__QUwQjS4nMjSgVzqbjl7Ve36A1_4pDR_IMtfTWxlfX3YcaSkJxHw4J3TBQOcfrMbSrN2A8n5ZrSAn-GeKUnkLoaP9qR5gsn3oU9Ognsc14lA0YmQepMk1lMi38Z14H6o5qMr3Ol2SypKC499lIkE5jUAKo_9iep4AUqUZLOHsg-jisspLYBX1NZDBHtOqjzIiEqADCJftxo2MmeCrU5YIqs4hzRPkeexd',
      refresh_token:
        'AQDL8m-MQ1EXzEi_e9EAtgO8fcQA8p8eDi1DgHHTxToaQLKwzwQ7LZD0jnee_1TftcMVLuIrCa-yAv7pFg4axKiwgu8F91yHV0giGtVT8y-qgisiuCXWUmdC7JlD1XsUkkk',
      query: '',
      queryResults: { tracks: {} },
      likesCurrentSong: false,
      manual_progress: 0
    };

    this.setState = this.setState.bind(this);
    this.login = this.login.bind(this);
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.playSong = this.playSong.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.seek = this.seek.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.seekNext = this.seekNext.bind(this);
    this.seekPrevious = this.seekPrevious.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.toggleRepeat = this.toggleRepeat.bind(this);
    this.incrementProgress = this.incrementProgress.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.clearInterval = this.clearInterval.bind(this);
    this.clearInput = this.clearInput.bind(this);
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
        this.getCurrentlyPlaying
      );
    } else {
      this.login();
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
        this.setState(
          {
            isAuthenticated: true
          },
          this.getCurrentlyPlaying
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
        if (data.is_playing) {
          this.startInterval();
        }
        this.setState(
          {
            playState: data,
            manual_progress: data.progress_ms
          },
          this.checkLikeStatus
        );
      }
    });
  }

  checkLikeStatus() {
    if (this.state.playState.item.id) {
      $.ajax({
        url: `https://api.spotify.com/v1/me/tracks/contains?ids=${this.state.playState.item.id}`,
        type: 'GET',
        beforeSend: xhr => {
          xhr.setRequestHeader(
            'Authorization',
            'Bearer ' + this.state.access_token
          );
        },
        success: response => {
          this.setState({
            likesCurrentSong: response[0]
          });
        }
      });
    }
  }

  playSong(context_uri, song_number) {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/play',
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      // data: JSON.stringify({context_uri}),
      data: JSON.stringify({
        context_uri: context_uri,
        offset: {
          position: song_number - 1
        },
        position_ms: 0
      }),
      beforeSend: xhr => {
        xhr.setRequestHeader(
          'Authorization',
          'Bearer ' + this.state.access_token
        );
      },
      success: () => {
        this.clearInput();
        this.startInterval();
        this.getCurrentlyPlaying();
        this.checkLikeStatus();
      },
      error: err => {
        console.log(err);
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
      success: this.getCurrentlyPlaying,
      error: err => {
        if (err.status === 403 || err.status === 404) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
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
      success: () => {
        this.clearInterval();
        this.getCurrentlyPlaying();
      },
      error: err => {
        this.clearInterval();
        if (err.status === 403 || err.status === 404) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
        console.log(err);
      }
    });
  }

  seek() {
    const { manual_progress } = this.state;
    // seek/scrub to part of song
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/seek?position_ms=${manual_progress}`,
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
      success: result => {
        this.setState(state => {
          state.playState.item.progress_ms = parseInt(result);
          return {
            playState: state.playState,
            manual_progress
          };
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  handleSliderChange(event) {
    console.log(event.target);
    // this.setState(state => {
    //   state.playState.progress_ms = event.target.value;
    //   return { playState: state.playState.progress_ms };
    // }, this.seekThrottle);
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
      success: this.getCurrentlyPlaying,
      error: err => {
        if (err.status === 403 || err.status === 404) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
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
      success: this.getCurrentlyPlaying,
      error: err => {
        if (err.status === 403 || err.status === 404) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
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

  handleSearchButtonClick() {
    if (this.state.showSearchBar) {
      this.setState(state => {
        return {
          showSearchBar: !state.showSearchBar,
          showSearchBar: false
        };
      });
    } else {
      this.setState(state => {
        return {
          showSearchBar: !state.showSearchBar
        };
      });
    }
  }

  toggleShuffle() {
    console.log('toggling shuffle!!');
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/shuffle?state=${!this.state
        .playState.shuffle_state}`,
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
      success: this.getCurrentlyPlaying,
      error: err => {
        if (err.status === 403 || err.status === 404) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
        console.log(err);
      }
    });
  }

  toggleLike() {
    console.log('toggling like!!');
    if (this.state.likesCurrentSong) {
      $.ajax({
        url: `https://api.spotify.com/v1/me/tracks?ids=${this.state.playState.item.id}`,
        type: 'DELETE',
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
        success: this.getCurrentlyPlaying,
        error: err => {
          if (err.status === 403 || err.status === 404) {
            this.getCurrentlyPlaying();
          } else if (err.status === 401) {
            this.getNewAccessToken();
          }
          console.log(err);
        }
      });
    } else {
      $.ajax({
        url: `https://api.spotify.com/v1/me/tracks?ids=${this.state.playState.item.id}`,
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
        success: this.getCurrentlyPlaying,
        error: err => {
          if (err.status === 403 || err.status === 404) {
            this.getCurrentlyPlaying();
          } else if (err.status === 401) {
            this.getNewAccessToken();
          }
          console.log(err);
        }
      });
    }
  }

  toggleRepeat() {
    let repeat_state;
    if (this.state.playState.repeat_state === 'context') {
      repeat_state = 'off';
    } else {
      repeat_state = 'context';
    }
    console.log('toggling repeat!!');
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/repeat?state=${repeat_state}`,
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
      success: this.getCurrentlyPlaying,
      error: err => {
        this.clearInterval();
        if (err.status === 403 || err.status === 404) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
        console.log(err);
      }
    });
  }

  incrementProgress() {
    this.setState(state => {
      state.playState.progress_ms += 1000;
      if (
        state.playState.item.duration_ms - state.playState.progress_ms <
        2000
      ) {
        setTimeout(() => {
          this.getCurrentlyPlaying();
        }, 2000);
      }
      return { playState: state.playState };
    });
  }

  startInterval() {
    const intervalID = setInterval(this.incrementProgress, 1000);
    this.setState({ intervalID });
  }

  clearInterval() {
    clearInterval(this.state.intervalID);
    this.setState({ intervalID: null });
  }

  clearInput() {
    this.setState({ query: '', queryResults: { tracks: {} } });
  }

  // using the refresh token, get a new access token (I believe they last an hour)
  getNewAccessToken() {
    $.ajax({
      url: '/refresh_token',
      type: 'GET',
      data: {
        refresh_token: this.state.refresh_token
      },
      success: data => {
        console.log(data);
        this.setState(
          { access_token: data.access_token },
          setTimeout(() => {
            this.getNewAccessToken();
          }, 3500)
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }

  render() {
    const { queryResults, likesCurrentSong, playState } = this.state;
    const { is_playing, item, shuffle_state, repeat_state } = playState;
    const { progress_ms } = playState;
    const { duration_ms } = playState.item || 0;
    queryResults.tracks.items = queryResults.tracks.items || [];
    if (this.state.isAuthenticated) {
      return (
        <div className='App'>
          {/* <button
            className='btn btn-default'
            id='obtain-new-token'
            onClick={this.getNewAccessToken}
          >
            Refresh Token
          </button> */}
          <div
            className='d-inline-flex justify-content-center'
            id='player-front'
          >
            <div className='player-grid'>
              <div
                className='search-container d-flex align-items-center justify-content-center'
                onClick={this.handleSearchButtonClick}
              >
                <span id='search' className='icon'></span>
              </div>

              <div className='artwork-container'>
                <img
                  id='artwork'
                  src={item ? item.album.images[1].url : ''}
                  alt='Album artwork'
                ></img>
              </div>

              <div className='song-name-container'>
                <span id='song-name'>{item ? item.name : ''}</span>
              </div>

              <div className='artist-name-container'>
                <div id='artist-name'>
                  {item.album.artists
                    .map(artist => {
                      return artist.name;
                    })
                    .join(' & ')}
                </div>
              </div>

              <Like
                likesCurrentSong={likesCurrentSong}
                toggleLike={this.toggleLike}
              />

              <PlaybackSlider
                handleSliderChange={this.handleSliderChange}
                progress_ms={progress_ms}
                duration_ms={duration_ms}
              />

              <Shuffle
                shuffle_state={shuffle_state}
                toggleShuffle={this.toggleShuffle}
              />

              <div
                className='previous-container d-flex align-items-center justify-content-center'
                onClick={this.seekPrevious}
              >
                <span id='previous' className='icon'></span>
              </div>

              <PlayPause
                is_playing={is_playing}
                resume={this.resume}
                pause={this.pause}
              />

              <div
                className='next-container d-flex align-items-center justify-content-center'
                onClick={this.seekNext}
              >
                <span id='next' className='icon'></span>
              </div>

              <Repeat
                repeat_state={repeat_state}
                toggleRepeat={this.toggleRepeat}
              />
              <SearchBar
                showSearchBar={this.state.showSearchBar}
                query={this.state.query}
                handleQueryChange={this.handleQueryChange}
              />
              <div className='search-results-container'>
                {queryResults.tracks.items.map(song => {
                  return (
                    <SearchResult
                      result={song}
                      playSong={this.playSong}
                      showSearchBar={this.state.showSearchBar}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='container d-flex align-items-center justify-content-center'>
          <div id='login'>
            <div className='spotify-logo-container d-flex align-items-center justify-content-center'>
              <img
                src='http://localhost:3000/spotify-icon.png'
                id='spotify-logo'
              ></img>
            </div>
            <h1 className='intro' id='minify-top'>
              Welcome to
            </h1>
            <div className='minify-container'>
              <h1 className='minify'>Minify</h1>
            </div>
            <div className='spotify-logo-container'>
              <p className='subtle'>A Spotify Mini-Player</p>
            </div>
            <h1 className='intro'>Please login to Spotify below</h1>
            <div id='login-button-container'>
              <a
                href='http://localhost:8888/login'
                id='login-button'
                className='d-flex align-items-center justify-content-center'
              >
                LOG IN WITH SPOTIFY
              </a>
            </div>
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
