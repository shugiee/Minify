import { getNewAccessToken } from './accessTokenActions';

export const resume = (access_token, refresh_token) => dispatch => {
  // console.log('resume called!');
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
    // TODO -- can I optimize this to immediately update state and re-render play button??
    success: this.getCurrentlyPlaying,
    error: err => {
      if (err.status === 403 || err.status === 404) {
        // this.getCurrentlyPlaying();
        console.error(err);
      } else if (err.status === 401) {
        dispatch(getNewAccessToken(refresh_token));
      }
      console.error(err);
    },
  });
};
