import * as helperJS from '../../helperJS';

const initialState = { 
  playState: helperJS.templateCurrentSong,
  access_token: '',
  likesCurrentSong: false, 
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      console.log('HEREHERHERHERH', state);
      console.log(`state during toggle like: ${JSON.stringify(state)}`);
      return { ...state }; // since this component only has access to state.likesCurrentSong, here state = state.likesCurrentSong
    case 'GET_LIKE_STATUS':
      console.log('getting like status!');
    default:
      return state;
  }
}
