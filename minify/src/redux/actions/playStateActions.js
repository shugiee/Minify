export const savePlayState = playState => dispatch => {
  dispatch({
    type: 'SAVE_PLAY_STATE',
    payload: playState,
  });
};
