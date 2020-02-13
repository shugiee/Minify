const initialState = null;

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOP_SONG':
      return action.payload;
    default:
      return state;
  }
}
