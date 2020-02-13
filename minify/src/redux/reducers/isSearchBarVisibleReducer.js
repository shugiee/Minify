const initialState = false;

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_SEARCH_BAR_VISIBILITY':
      return !state;
    default:
      return state;
  }
}
