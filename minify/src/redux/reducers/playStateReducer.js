import * as helperJS from '../../helperJS';

const initialState = {
  playState: helperJS.templateCurrentSong,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SAVE_PLAY_STATE':
      return { ...action.payload };
    default:
      return { ...state };
  }
}
