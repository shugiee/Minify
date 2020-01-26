const initialState = { likesCurrentSong: false };

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      return !state; // since this component only has access to state.likesCurrentSong, here state = state.likesCurrentSong
    default:
      return state;
  }
}
