import * as helperJS from '../../helperJS';

const initialState = {
  playState: helperJS.templateCurrentSong,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'GET_PLAY_STATE':
      state.playStats.shuffle_state = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
}
