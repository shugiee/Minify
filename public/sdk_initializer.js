window.onSpotifyWebPlaybackSDKReady = () => {
  const token =
    'BQBvQavPF27sdSdM3VZsWniL76TASp-M0OESAECOi_1N3_1Cgs0cV-WnXacJXUiGbUQwtvF0fr-hD4td_lvwZ4i6zcmmR8jNqFKAUnoThLzEPvJ6R9xPZU3Su4Gpy26enK6fxtolQCKNtRO2cohGwXPRIhwKQHhMBtlA';
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => {
      cb(token);
    }
  });

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

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect();
};
