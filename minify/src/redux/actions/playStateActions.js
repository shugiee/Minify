export const savePlayState = playState => dispatch => {
  dispatch({
    type: 'GET_PLAY_STATE',
    payload: playState,
  });
};
