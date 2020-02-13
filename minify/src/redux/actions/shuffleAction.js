import $ from 'jquery';
import { getNewAccessToken } from './accessTokenActions';

export const toggleShuffle = (
  shuffle_state,
  access_token,
  refresh_token
) => dispatch => {
  console.log('toggle shuffle called!!');
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
    success: () => {
      console.log('successful');
      // this.getCurrentlyPlaying,
    },
    error: err => {
      // if (err.status === 403 || err.status === 404) {
      //   this.getCurrentlyPlaying();
      // } else if (err.status === 401) {
      //   this.getNewAccessToken();
      // }
      if (err.status === 401) {
        dispatch(getNewAccessToken(refresh_token));
      } else {
        console.error(err);
      }
    },
  });
  console.log('here');
  dispatch({
    type: 'TOGGLE_SHUFFLE',
  });
};
