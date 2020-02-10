import * as helperJS from '../../helperJS';

const initialState = {
  // playState: helperJS.templateCurrentSong,
  // access_token: '',
  // TEST: 'TEST',
  likesCurrentSong: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      return { ...state, likesCurrentSong: !state.likesCurrentSong };
    case 'GET_LIKE_STATUS':
      return { ...state, likesCurrentSong: action.payload };
    default:
      return state;
  }
}
