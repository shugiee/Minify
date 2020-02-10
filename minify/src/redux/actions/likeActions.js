import $ from 'jquery';
import { getNewAccessToken } from './accessTokenActions';

// when a user clicks like or unlike on a song, toggle its status
export const toggleLike = (
  playState,
  likesCurrentSong,
  access_token,
  refresh_token
) => dispatch => {
  const reqType = likesCurrentSong ? 'DELETE' : 'PUT';
  $.ajax({
    url: `https://api.spotify.com/v1/me/tracks?ids=${playState.item.id}`,
    type: reqType,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    beforeSend: xhr => {
      xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    },
    // success: this.getCurrentlyPlaying,
    error: err => {
      if (err.status === 401) {
        dispatch(getNewAccessToken(refresh_token));
      } else {
        console.error(err);
      }
      // if (err.status === 403 || err.status === 404) {
      //   this.getCurrentlyPlaying();
      // } else if (err.status === 401) {
      //   this.getNewAccessToken();
      // } else {
      //   console.error(err);
      // }
    },
  }).then(() => {
    dispatch({
      type: 'TOGGLE_LIKE',
    });
  });
};

export const getLikeStatus = (playState, access_token) => dispatch => {
  console.log('get like status action!!!');
  console.log('PLAYSTATE:', playState);
  $.ajax({
    url: `https://api.spotify.com/v1/me/tracks/contains?ids=${playState.item.id}`,
    type: 'GET',
    beforeSend: xhr => {
      xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    },
    success: response => {
      console.log('RESPONSE', response);
      dispatch({
        type: 'GET_LIKE_STATUS',
        payload: response,
      });
    },
  });
};
