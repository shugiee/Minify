import * as helperJS from '../../helperJS';

const initialState = { 
  playState: helperJS.templateCurrentSong,
  access_token: '',
  likesCurrentSong: false, 
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      console.log(`state during toggle like: ${JSON.stringify(state.likesCurrentSong)}`);
      const newState = { ...state, likesCurrentSong: state.likesCurrentSong };
      console.log('NEW STATE:', newState);
      return { ...state, likesCurrentSong: state.likesCurrentSong };
    case 'GET_LIKE_STATUS':
      console.log('getting like status!');
      return state;
    default:
      return state;
  }
}
