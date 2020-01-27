import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import * as helperJS from '../helperJS';

const initialState = {
      playState: helperJS.templateCurrentSong,
      isAuthenticated: false,
      access_token: '',
      refresh_token: '',
      topSong: null,
      query: '',
      queryResults: {
        tracks: { items: [] },
        albums: { items: [] },
        artists: { items: [] },
        playlists: { items: [] },
      },
      likesCurrentSong: false,
      shuffle_state: false,
      timer: 1,
      isSearchBarVisible: false,
};


const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
