const initialState = '';

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return action.payload;
    default:
      return state;
  }
}
