// when a user clicks like or unlike on a song, toggle its status
export const toggleLike = () => dispatch => {
  console.log('like toggled!!');
  dispatch({
    type: 'TOGGLE_LIKE',
  });
};

// simply report whether the user likes the current song or not
export const getLikeStatus = () => {
  console.log('get like toggled!');
  dispatch({
    type: 'GET_LIKE_STATUS'
  });
};
