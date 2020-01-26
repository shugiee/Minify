const initialState = { likesCurrentSong: false };

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      console.log('like reducer running!!');
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
