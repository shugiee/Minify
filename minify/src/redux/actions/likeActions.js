export const toggleLike = () => dispatch => {
  console.log('like toggled!!');
  dispatch({
    type: 'TOGGLE_LIKE',
    payload: true,
  });
};
