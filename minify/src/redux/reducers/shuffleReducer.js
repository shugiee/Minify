const initialState = false;

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_SHUFFLE':
      return !state.shuffle_state;
    default:
      return state;
  }
}
