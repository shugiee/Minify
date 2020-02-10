export const savePlayState = playState => dispatch => {
  console.log('save playstate action');
  dispatch({
    type: 'GET_PLAY_STATE',
    payload: playState,
  });
};
