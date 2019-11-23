import React from 'react';
import $ from 'jquery';
import './App.css';
import _ from 'lodash';
import PlayPause from './PlayPause.jsx';
import Like from './Like.jsx';
import PlaybackSlider from './PlaybackSlider.jsx';
import Shuffle from './Shuffle.jsx';
import Repeat from './Repeat.jsx';
import SearchBar from './SearchBar.jsx';
import SearchResultAll from './SearchResultsAll.jsx';
import * as helperJS from './helperJS';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      playState: helperJS.templateCurrentSong,
      isAuthenticated: false,
      access_token: '',
      refresh_token: '',
      devices: [],
      topSong: null,
      query: '',
      queryResults: {
        tracks: { items: [] },
        albums: { items: [] },
        artists: { items: [] },
        playlists: { items: [] },
      },
      likesCurrentSong: false,
      manual_progress: 0,
      timer: 1,
    };

    this.setState = this.setState.bind(this);
    this.login = this.login.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.getTopSong = this.getTopSong.bind(this);
    this.playSong = this.playSong.bind(this);
    this.playAlbum = this.playAlbum.bind(this);
    this.playArtist = this.playArtist.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.seek = this.seek.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderClick = this.handleSliderClick.bind(this);
    this.seekNext = this.seekNext.bind(this);
    this.seekPrevious = this.seekPrevious.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.toggleSearchVisibility = this.toggleSearchVisibility.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.toggleRepeat = this.toggleRepeat.bind(this);
    this.incrementProgress = this.incrementProgress.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.clearInterval = this.clearInterval.bind(this);
    this.clearInput = this.clearInput.bind(this);
    // this.clearProgress_ms = this.clearProgress_ms.bind(this);
    this.getNewAccessToken = this.getNewAccessToken.bind(this);
    this.transferDevice = this.transferDevice.bind(this);

    this.seekThrottle = _.throttle(this.seek, 500);
    this.searchSpotifyThrottle = _.throttle(this.searchSpotify, 250);
  }

  componentDidMount() {
    // if user just logged in, get their access_token from the url
    const tokens = helperJS.getUrlVars();
    if (tokens.access_token && tokens.refresh_token) {
      this.setState(
        {
          isAuthenticated: true,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        },
        () => {
          this.getCurrentUser();
          this.getCurrentlyPlaying();
        }
      );
    } else {
      this.login();
    }
  }

  login() {
    console.log('login called!');
    $.ajax({
      url: '/login',
      type: 'GET',
      error: err => {
        console.error(err);
      },
      success: xhr => {
        this.setState(
          {
            isAuthenticated: true,
          },
          () => {
            this.getCurrentUser();
            this.getCurrentlyPlaying();
          }
        );
      },
    });
  }

  getCurrentUser() {
    console.log('get current user called!');
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader(
          'Authorization',
          'Bearer ' + this.state.access_token
        );
      },
      success: user => {
        if (user) {
          this.setState({ user });
        }
      },
      error: err => console.error(err),
    });
  }

  getCurrentlyPlaying() {
    console.log('get currently playing called!');
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player',
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader(
          'Authorization',
          `Bearer ${this.state.access_token}`
        );
      },
      success: data => {
        if (data) {
          this.startInterval();
          // data.item is null if a search reasult was just played, which causes downstream errors
          // to combat this, use old item; it will be wiped in subsequent API calls anyway
          data.item = data.item ? data.item : this.state.playState.item;
          this.setState(
            {
              playState: data,
            },
            () => {
              if (!data.is_playing) {
                this.clearInterval();
              }
              this.checkLikeStatus();
            }
          );
        } else {
          this.getTopSong();
        }
      },
    });
  }

  getDevices() {
    console.log('get devices called!');
    if (!this.state.topSong) {
      console.log('getting new top song!!');
      $.ajax({
        url: 'htthttps://api.spotify.com/v1/me/player/devices',
        type: 'GET',
        beforeSend: xhr => {
          xhr.setRequestHeader(
            'Authorization',
            'Bearer ' + this.state.access_token
          );
        },
        success: data => {
          this.setState({ devices: data.devices }, () => {
            this.playSong(this.state.topSong, 'topSong');
          });
        },
        error: err => console.error(err),
      });
    } else {
      console.log('Top track already saved! ');
    }
  }

  getTopSong() {
    console.log('get top song called!');
    if (!this.state.topSong) {
      console.log('getting new top song!!');
      $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?limit=1',
        type: 'GET',
        beforeSend: xhr => {
          xhr.setRequestHeader(
            'Authorization',
            'Bearer ' + this.state.access_token
          );
        },
        success: songs => {
          const topSong = songs.items[0];
          this.setState({ topSong }, () => {
            this.playSong(topSong, 'topSong');
          });
        },
        error: err => console.error(err),
      });
    } else {
      console.log('Top track already saved! ');
    }
  }

  checkLikeStatus() {
    console.log('check like status called!');
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
            likesCurrentSong: response[0],
          });
        },
      });
    }
  }

  playSong(song, origin, device_id) {
    console.log(`play song called from origin: ${origin}`);
    // Save this new song as playState.item, to immediately render song data
    this.setState(
      state => {
        state.playState.item = song;
        return { playState: state.playState };
      },
      // wrap the following in the setState callback to only run after updating on-screen playback information
      () => {
        const device = device_id || '';
        let data;
        // if playing top song, use 'uris' array instead of context
        if (origin === 'topSong') {
          data = JSON.stringify({
            uris: [song.uri],
            position_ms: 0,
          });
        } else {
          data = JSON.stringify({
            context_uri: song.album.uri,
            offset: {
              position: song.track_number - 1,
            },
            position_ms: 0,
          });
        }
        $.ajax({
          url: `https://api.spotify.com/v1/me/player/play${device}`,
          type: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          data: data,
          beforeSend: xhr => {
            xhr.setRequestHeader(
              'Authorization',
              'Bearer ' + this.state.access_token
            );
          },
          success: song => {
            this.clearInput();
            this.getCurrentlyPlaying();
          },
          error: err => {
            console.error(err);
          },
        });
      }
    );
  }

  playAlbum(album) {}

  playArtist(artist) {}

  playPlaylist(playlist) {}

  resume() {
    console.log('resume called!');
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/play',
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        console.error(err);
      },
    });
  }

  pause() {
    console.log('pause called!');
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/pause',
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        console.error(err);
      },
    });
  }

  seek(cb = null) {
    console.log('seek called!');
    const { playState } = this.state;
    // seek/scrub to part of song
    if (playState.progress_ms) {
      $.ajax({
        url: `https://api.spotify.com/v1/me/player/seek?position_ms=${playState.progress_ms}`,
        type: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        beforeSend: xhr => {
          xhr.setRequestHeader(
            'Authorization',
            'Bearer ' + this.state.access_token
          );
        },
        success: result => {
          this.setState(state => {
            state.playState.progress_ms = parseInt(result);
            return {
              playState: state.playState,
            };
          });
          if (cb) {
            cb();
          }
        },
        error: err => {
          console.error(err);
        },
      });
    }
  }

  handleSliderChange(event) {
    console.log('handle slider change called!');
    const { playState } = this.state;
    playState.progress_ms = event.target.value || 0;
    this.setState({ playState });
  }

  handleSliderClick(event) {
    console.log('handle slider click called!');
    const { playState } = this.state;
    playState.progress_ms = event.target.value || 0;
    this.setState({ playState }, () => {
      this.seekThrottle(this.getCurrentlyPlaying);
    });
  }

  seekNext() {
    console.log('seek next called!');
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/next',
      type: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        console.error(err);
      },
    });
  }

  seekPrevious() {
    console.log('seek previous called!');
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/previous',
      type: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        console.error(err);
      },
    });
  }

  searchSpotify() {
    console.log('search spotify called!');
    const { query } = this.state;
    const joinedQuery = query.replace(' ', '%20');
    if (query.length) {
      $.ajax({
        url: `https://api.spotify.com/v1/search?q=${joinedQuery}&type=album,artist,playlist,track&limit=3`,
        type: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
          console.error(err);
        },
      });
    }
  }

  handleQueryChange(event) {
    console.log('handle query change called!');
    this.setState({ query: event.target.value }, this.searchSpotifyThrottle);
  }

  toggleSearchVisibility() {
    this.setState(state => {
      return {
        showSearchBar: !state.showSearchBar,
      };
    });
  }

  toggleShuffle() {
    console.log('toggle shuffle called!!');
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/shuffle?state=${!this.state
        .playState.shuffle_state}`,
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        console.error(err);
      },
    });
  }

  toggleLike() {
    console.log('toggle like called!!');
    if (this.state.likesCurrentSong) {
      $.ajax({
        url: `https://api.spotify.com/v1/me/tracks?ids=${this.state.playState.item.id}`,
        type: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
          console.error(err);
        },
      });
    } else {
      $.ajax({
        url: `https://api.spotify.com/v1/me/tracks?ids=${this.state.playState.item.id}`,
        type: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
          console.error(err);
        },
      });
    }
  }

  toggleRepeat() {
    console.log('toggle repeat called!');
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
        'Content-Type': 'application/json',
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
        console.error(err);
      },
    });
  }

  incrementProgress() {
    console.log('increment progress called');
    this.setState(
      state => {
        state.playState.progress_ms += 1000;
        state.timer = (state.timer + 1) % 5;
        if (
          state.playState.item.duration_ms - state.playState.progress_ms <
          2000
        ) {
          setTimeout(() => {
            // this.clearProgress_ms();
            this.getCurrentlyPlaying();
          }, 2000);
        }
        return { playState: state.playState };
      },
      () => {
        if (this.state.timer % 5 === 0) {
          this.getCurrentlyPlaying();
        }
      }
    );
  }

  startInterval() {
    this.clearInterval();
    console.log('start interval called!');
    const intervalID = setInterval(this.incrementProgress, 1000);
    this.setState({ intervalID });
  }

  clearInterval() {
    console.log('clear interval called');
    clearInterval(this.state.intervalID);
    this.setState({ intervalID: null });
  }

  clearInput() {
    console.log('clear input called');
    this.setState({
      query: '',
      queryResults: {
        tracks: { items: [] },
        albums: { items: [] },
        artists: { items: [] },
        playlists: { items: [] },
      },
    });
  }

  // using the refresh token, get a new access token (I believe they last an hour)
  getNewAccessToken() {
    console.log('get new access token called');
    $.ajax({
      url: '/refresh_token',
      type: 'GET',
      data: {
        refresh_token: this.state.refresh_token,
      },
      success: data => {
        this.setState(
          { access_token: data.access_token },
          setTimeout(() => {
            this.getNewAccessToken();
          }, 3500)
        );
      },
      error: err => {
        console.error(err);
      },
    });
  }

  transferDevice(device_id) {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player`,
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        device_ids: device_id,
      }),
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
        console.error(err);
      },
    });
  }

  render() {
    const {
      queryResults,
      likesCurrentSong,
      playState,
      showSearchBar,
    } = this.state;
    let { is_playing, item, shuffle_state, repeat_state } = playState;
    const { progress_ms } = playState;
    item = item || { album: { images: ['', ''] }, duration_ms: 0 };
    const artists = item.album.artists || [];

    if (this.state.isAuthenticated) {
      return (
        <div className='App'>
          <div
            className='d-inline-flex justify-content-center'
            id='player-front'
          >
            <div className='player-grid'>
              <div
                className='search-container d-flex align-items-center justify-content-center'
                onClick={this.toggleSearchVisibility}
              >
                <span id='search-button' className='icon' />
              </div>

              <div className='artwork-container'>
                <img
                  id='artwork'
                  src={item.album.images[1].url}
                  alt='Album artwork'
                />
              </div>

              <div className='song-name-container'>
                <span id='song-name'>{item ? item.name : ''}</span>
              </div>

              <div className='artist-name-container'>
                <div id='artist-name'>
                  {artists
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
                duration_ms={item.duration_ms}
                handleSliderClick={this.handleSliderClick}
              />

              <Shuffle
                shuffle_state={shuffle_state}
                toggleShuffle={this.toggleShuffle}
              />

              <div
                className='previous-container d-flex align-items-center justify-content-center'
                onClick={this.seekPrevious}
              >
                <span id='previous' className='icon' />
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
                <span id='next' className='icon' />
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
              <SearchResultAll
                queryResults={queryResults}
                playSong={this.playSong}
                playAlbum={this.playAlbum}
                playArtist={this.playArtist}
                playPlaylist={this.playPlaylist}
                toggleSearchVisibility={this.toggleSearchVisibility}
                showSearchBar={showSearchBar}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='container d-flex align-items-center justify-content-center'>
        <div id='login'>
          <div className='spotify-logo-container d-flex align-items-center justify-content-center'>
            <img
              src='http://localhost:3000/spotify-icon.png'
              id='spotify-logo'
            />
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
          <div className='subtle-credit-container d-flex align-items-center justify-content-center'>
            <p className='subtle-credit'>
              Made by{' '}
              <a href='https://github.com/MyNameIsJonathan' target='_blank'>
                Jay Olson
              </a>{' '}
              through the generosity of the public-facing{' '}
              <a
                href='https://developer.spotify.com/documentation/web-api/'
                target='_blank'
              >
                Spotify API
              </a>
            </p>
          </div>
        </div>
        <div id='loggedin'>
          <div id='user-profile' />
          <div id='oauth' />
        </div>
      </div>
    );
  }
}

export default App;
