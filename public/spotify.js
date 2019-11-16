/* eslint-disable no-console */
/* eslint-disable camelcase */
window.onSpotifyWebPlaybackSDKReady = () => {
  const token =
    'BQC_Cx-cfjehYovjqKmvq2du2A9ke5gJEtYrPjN-BFP7GCyhJatkkR-HrYGmI0ZdbJjyOa9My1-MdoTGrus-Q9UMc9-EJBp_PUxDb6O28mxdVwj4QgkpM8Jsj97pVuj79OF5Ss8Pg9GFCwz8Qn84whpqGwkNfIsHhmGy&refresh_token=AQB6wQSthMX1efFbao79jY2wyImRwfNYbs9IYgUMN3TlByzRMaKXmQKjPbFEYCaFviS_n4Dkq6cocxH-f8g6u9dyalSUdFLTyG42igT_FuJA631n9focR_4nv0pw03V62QE';
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
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
