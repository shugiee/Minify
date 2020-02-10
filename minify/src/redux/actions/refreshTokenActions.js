export const saveRefreshToken = refresh_token => dispatch => {
  dispatch({
    type: 'SAVE_REFRESH_TOKEN',
    payload: refresh_token,
  });
};
