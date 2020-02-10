const initialState = '';

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SAVE_ACCESS_TOKEN':
      return action.payload;
    default:
      return state;
  }
}
