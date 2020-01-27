import $ from 'jquery';

// when a user clicks like or unlike on a song, toggle its status
export const toggleLike = () => dispatch => {
  console.log('like toggled!!');
  dispatch({
    type: 'TOGGLE_LIKE',
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
