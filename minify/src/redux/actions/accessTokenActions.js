import $ from 'jquery';

export const saveAccessToken = access_token => dispatch => {
  dispatch({
    type: 'SAVE_ACCESS_TOKEN',
    payload: access_token,
  });
};

export const getNewAccessToken = refresh_token => dispatch => {
  $.ajax({
    url: 'http://localhost:8888/refresh_token',
    type: 'GET',
    data: {
      refresh_token,
    },
    success: data => {
      saveAccessToken(data.access_token);
      this.setState({ access_token: data.access_token }, () => {
        // TODO look into this callback; do I need it??
        // if (cb) {
        //   cb();
        // }
      });
    },
    error: err => {
      console.error(err);
    },
  });
};
