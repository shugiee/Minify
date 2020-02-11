const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'PAUSE':
      return state;
    case 'RESUME':
      return state;
    case 'SEEK':
      return state;
    default:
      return state;
  }
}
