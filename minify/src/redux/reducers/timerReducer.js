const initialState = 1;

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_TIMER':
      return action.payload;
    default:
      return state;
  }
}
