/* eslint-disable no-console */
/* eslint-disable camelcase */
window.onSpotifyWebPlaybackSDKReady = () => {
  const token =
    'BQBpC-TV9o4_LLtRhaWgHzqIADCRjPo_g8QRBKN-5mgYbECEVrBa4ISp4Z4-7gzk5NlJZbrFPxw6QPJlDFIqULOqfOShsyI-ADg1_fbYhoHHF9R480w0hIW3Cqpo8kXELm1RZqkZE9vUU9ExlF-THNHeQr0ZDmMXje-c';
  const player = new Spotify.Player({
    name: 'Song Player',
    getOAuthToken: cb => {
      cb(token);
    }
  });
  // Play a specified track on the Web Playback SDK's device ID
  function play(device_id) {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      type: 'PUT',
      data: '{"uris": ["spotify:track:5ya2gsaIhTkAuWYEMB0nw5"]}',
      beforeSend(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      },
      success(data) {
        console.log(data);
      }
    });
  }

  // Error handling
  player.addListener('initialization_error', ({ message }) => {
    console.log('init error!!');
    console.error(message);
  });
  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('account_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('playback_error', ({ message }) => {
    console.error(message);
  });

  // Playback status updates
  player.addListener('player_state_changed', state => {
    console.log(state);
  });

  // play button
  document.querySelector('#play').addEventListener('click', () => {
    player.resume().then(() => {
      console.log('Paused!');
    });
  });

  // pause button
  document.querySelector('#pause').addEventListener('click', () => {
    player.pause().then(() => {
      console.log('Paused!');
    });
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    // Play a track using our new device ID
    console.log('Ready with Device ID', device_id);
    play(device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect().then(success => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    }
  });
};
