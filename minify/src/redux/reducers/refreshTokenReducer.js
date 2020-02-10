const initialState = '';

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SAVE_REFRESH_TOKEN':
      return action.payload;
    // TODO COMPLETE GET NEW REFRESH TOKEN
    case 'GET_NEW_REFRESH_TOKEN':
      return action.payload;
    default:
      return state;
  }
}
