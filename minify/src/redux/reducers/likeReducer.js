const initialState = false;

export default function(state = initialState, action) {
  const likesCurrentSong = state;
  switch (action.type) {
    case 'TOGGLE_LIKE':
      return !likesCurrentSong;
    case 'GET_LIKE_STATUS':
      return likesCurrentSong;
    default:
      return state;
  }
}
