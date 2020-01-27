// when a user clicks like or unlike on a song, toggle its status
export const toggleLike = () => dispatch => {
  console.log('like toggled!!');
  dispatch({
    type: 'TOGGLE_LIKE',
  });
};
