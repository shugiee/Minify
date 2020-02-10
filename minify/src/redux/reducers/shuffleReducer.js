import * as helperJS from '../../helperJS';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_SHUFFLE':
      state.playStats.shuffle_state = !state.playStats.shuffle_state;
      return { ...state };
    case 'GET_SHUFFLE_STATUS':
      state.playStats.shuffle_state = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
}
