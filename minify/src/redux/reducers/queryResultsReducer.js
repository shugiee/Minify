const initialState = {
  tracks: { items: [] },
  albums: { items: [] },
  artists: { items: [] },
  playlists: { items: [] },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_QUERY_RESULTS':
      return action.payload;
    default:
      return { ...state };
  }
}
