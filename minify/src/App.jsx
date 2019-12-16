/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import React from 'react';
import $ from 'jquery';
import './App.css';
import _ from 'lodash';
import PlayPause from './PlayPause';
import Like from './Like';
import PlaybackSlider from './PlaybackSlider';
import Shuffle from './Shuffle';
import Repeat from './Repeat';
import SearchBar from './SearchBar';
import SearchResultAll from './SearchResultsAll';
import * as helperJS from './helperJS';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playState: helperJS.templateCurrentSong,
      isAuthenticated: false,
      access_token: '',
      refresh_token: '',
      topSong: null,
      query: '',
      queryResults: {
        tracks: { items: [] },
        albums: { items: [] },
        artists: { items: [] },
        playlists: { items: [] },
      },
      likesCurrentSong: false,
      shuffle_state: false,
      timer: 1,
      isSearchBarVisible: false,
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

  // using the refresh token, get a new access token (I believe they last an hour)
  getNewAccessToken(cb) {
    console.log('get new access token called');
    const { refresh_token } = this.state;
    $.ajax({
      url: 'http://52.52.252.234:8888/refresh_token',
      type: 'GET',
      data: {
        refresh_token,
      },
      success: data => {
        this.setState({ access_token: data.access_token }, () => {
          if (cb) {
            cb();
          }
        });
      },
      error: err => {
        console.error(err);
      },
    });
  }

  getCurrentUser() {
    console.log('get current user called!');
    const { access_token } = this.state;
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
    const { access_token, playState } = this.state;
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player',
      type: 'GET',
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
      },
      success: data => {
        if (data) {
          this.startInterval();
          // data.item is null if a search reasult was just played, which causes downstream errors
          // to combat this, use old item; it will be wiped in subsequent API calls anyway
          data.item = data.item ? data.item : playState.item;
          this.setState(
            {
              playState: data,
              shuffle_state: data.shuffle_state,
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
      error: err => {
        // if token is expired, get a new one
        if (err.status === 401) {
          this.getNewAccessToken(this.getCurrentlyPlaying);
        }
      },
    });
  }

  getDevices() {
    console.log('get devices called!');
    const { topSong, access_token } = this.state;
    if (!topSong) {
      console.log('getting new top song!!');
      $.ajax({
        url: 'https://api.spotify.com/v1/me/player/devices',
        type: 'GET',
        beforeSend: xhr => {
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        },
        success: data => {
          this.setState({ devices: data.devices }, () => {
            this.playSong(topSong, 'topSong');
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
    const { topSong, access_token } = this.state;
    if (!topSong) {
      console.log('getting new top song!!');
      $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?limit=1',
        type: 'GET',
        beforeSend: xhr => {
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        },
        success: songs => {
          const newTopSong = songs.items[0];
          this.setState({ topSong: newTopSong }, () => {
            this.playSong(newTopSong, 'topSong');
          });
        },
        error: err => console.error(err),
      });
    } else {
      console.log('Top track already saved! ');
    }
  }

  playSong(song, origin, device_id) {
    console.log(`play song called from origin: ${origin}`);
    const { access_token } = this.state;
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
          data,
          beforeSend: xhr => {
            xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
          },
          success: () => {
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

  playAlbum(album) {
    console.log(`play album called`);
    const { access_token } = this.state;
    $.ajax({
      url: `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=1&offset=0`,
      type: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
      },
      success: songs => {
        songs.items[0].album = album;
        this.playSong(songs.items[0], 'searchResult');
      },
      error: err => {
        console.error(err);
      },
    });
  }

  playArtist(artist) {
    console.log(`play artist called`);
    const { access_token } = this.state;
    $.ajax({
      url: `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=ES`,
      type: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
      },
      success: songs => {
        this.playSong(songs.tracks[0], 'searchResult');
      },
      error: err => {
        console.error(err);
      },
    });
  }

  playPlaylist(playlist) {
    console.log(`play playlist called`);
    const { access_token } = this.state;
    $.ajax({
      url: `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=1&offset=0`,
      type: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
      },
      success: songs => {
        console.log(songs.items[0]);
        this.playSong(songs.items[0].track, 'searchResult');
      },
      error: err => {
        console.error(err);
      },
    });
  }

  resume() {
    console.log('resume called!');
    const { access_token } = this.state;
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/play',
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
    const { access_token } = this.state;
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/pause',
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
    const { playState, access_token } = this.state;
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
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        },
        success: result => {
          this.setState(state => {
            state.playState.progress_ms = parseInt(result, 10);
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
    const { access_token } = this.state;
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/next',
      type: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
      },
      error: err => {
        if (err.status === 403) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
        console.error(err);
      },
      complete: this.getCurrentlyPlaying,
    });
  }

  seekPrevious() {
    console.log('seek previous called!');
    const { access_token } = this.state;
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/previous',
      type: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
      },
      error: err => {
        if (err.status === 403 || err.status === 404) {
          this.getCurrentlyPlaying();
        } else if (err.status === 401) {
          this.getNewAccessToken();
        }
        console.error(err);
      },
      complete: this.getCurrentlyPlaying,
    });
  }

  searchSpotify() {
    console.log('search spotify called!');
    const { query, access_token } = this.state;
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
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
        isSearchBarVisible: !state.isSearchBarVisible,
      };
    });
  }

  toggleShuffle() {
    console.log('toggle shuffle called!!');
    const { shuffle_state, access_token } = this.state;
    this.setState({ shuffle_state: !shuffle_state });
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle_state}`,
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
    const { likesCurrentSong, playState, access_token } = this.state;
    // immediate change state, then ping spotify to toggle like
    const isLiked = likesCurrentSong;
    this.setState({ likesCurrentSong: !isLiked });
    if (isLiked) {
      $.ajax({
        url: `https://api.spotify.com/v1/me/tracks?ids=${playState.item.id}`,
        type: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        beforeSend: xhr => {
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
        url: `https://api.spotify.com/v1/me/tracks?ids=${playState.item.id}`,
        type: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        beforeSend: xhr => {
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
    const { access_token, playState } = this.state;
    let repeat_state;
    // first, update state; next, ping spotify api to toggle repeat status
    if (playState.repeat_state === 'context') {
      repeat_state = 'off';
    } else {
      repeat_state = 'context';
    }
    playState.repeat_state = repeat_state;
    this.setState({ playState });
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/repeat?state=${repeat_state}`,
      type: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      beforeSend: xhr => {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
    const { timer } = this.state;
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
        if (timer % 5 === 0) {
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
    const { intervalID } = this.state;
    console.log('clear interval called');
    clearInterval(intervalID);
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

  checkLikeStatus() {
    // Query spotify to see if the  current song is liked by the current user
    const { playState, access_token } = this.state;
    console.log('check like status called!');
    if (playState.item.id) {
      $.ajax({
        url: `https://api.spotify.com/v1/me/tracks/contains?ids=${playState.item.id}`,
        type: 'GET',
        beforeSend: xhr => {
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        },
        success: response => {
          this.setState({
            likesCurrentSong: response[0],
          });
        },
      });
    }
  }

  login() {
    // Use an aws-hosted authentication express server that interacts directly with Spotify to authenticate users
    // Response is to redirect the user to 52.52.252.234:3000/, with the refresh_token and accesss_tokens as params
    console.log('login called!');
    $.ajax({
      url: 'http://52.52.252.234:8888/login',
      type: 'GET',
      error: err => {
        console.error(err);
      },
      success: (data, textStatus, xhr) => {
        console.log('LOGGED IN');
        console.log(data);
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

  transferDevice(device_id) {
    const { access_token } = this.state;

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
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
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
      isSearchBarVisible,
      shuffle_state,
      isAuthenticated,
      query,
    } = this.state;
    let { is_playing, item, repeat_state } = playState;
    const { progress_ms } = playState;
    item = item || { album: { images: ['', ''] }, duration_ms: 0 };
    const artists = item.album.artists || [];

    if (isAuthenticated) {
      return (
        <div className="App">
          <div
            className="d-inline-flex justify-content-center"
            id="player-front"
          >
            <div className="player-grid">
              <div
                className="search-container d-flex align-items-center justify-content-center"
                onClick={this.toggleSearchVisibility}
              >
                <span id="search-button" className="icon" />
              </div>

              <div className="artwork-container">
                <img
                  id="artwork"
                  src={item.album.images[1].url}
                  alt="Album artwork"
                />
              </div>

              <div className="song-name-container">
                <span id="song-name">{item ? item.name : ''}</span>
              </div>

              <div className="artist-name-container">
                <div id="artist-name">
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
                className="previous-container d-flex align-items-center justify-content-center"
                onClick={this.seekPrevious}
              >
                <span id="previous" className="icon" />
              </div>

              <PlayPause
                is_playing={is_playing}
                resume={this.resume}
                pause={this.pause}
              />

              <div
                className="next-container d-flex align-items-center justify-content-center"
                onClick={this.seekNext}
              >
                <span id="next" className="icon" />
              </div>

              <Repeat
                repeat_state={repeat_state}
                toggleRepeat={this.toggleRepeat}
              />
              <SearchBar
                isSearchBarVisible={isSearchBarVisible}
                query={query}
                handleQueryChange={this.handleQueryChange}
              />
              <SearchResultAll
                queryResults={queryResults}
                playSong={this.playSong}
                playAlbum={this.playAlbum}
                playArtist={this.playArtist}
                playPlaylist={this.playPlaylist}
                toggleSearchVisibility={this.toggleSearchVisibility}
                isSearchBarVisible={isSearchBarVisible}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container d-flex align-items-center justify-content-center">
        <div id="login">
          <div className="spotify-logo-container d-flex align-items-center justify-content-center">
            <img
              src="http://52.52.252.234:3000/spotify-icon.png"
              id="spotify-logo"
              alt="Green Spotify icon"
            />
          </div>
          <h1 className="intro" id="minify-top">
            Welcome to
          </h1>
          <div className="minify-container">
            <h1 className="minify">Minify</h1>
          </div>
          <div className="spotify-logo-container">
            <p className="subtle">A Spotify Mini-Player</p>
          </div>
          <h1 className="intro">Please login to Spotify below</h1>
          <div id="login-button-container">
            <a
              href="http://52.52.252.234:8888/login"
              id="login-button"
              className="d-flex align-items-center justify-content-center"
            >
              LOG IN WITH SPOTIFY
            </a>
          </div>
          <div className="subtle-credit-container d-flex align-items-center justify-content-center">
            <p className="subtle-credit">
              Made by{' '}
              <a
                href="https://github.com/MyNameIsJonathan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jay Olson
              </a>{' '}
              through the generosity of the public-facing{' '}
              <a
                href="https://developer.spotify.com/documentation/web-api/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spotify API
              </a>
            </p>
          </div>
        </div>
        <div id="loggedin">
          <div id="user-profile" />
          <div id="oauth" />
        </div>
      </div>
    );
  }
}

export default App;
