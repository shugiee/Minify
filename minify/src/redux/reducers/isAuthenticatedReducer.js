const initialState = false;

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_AUTHENTICATION':
      return !state;
    default:
      return state;
  }
}
