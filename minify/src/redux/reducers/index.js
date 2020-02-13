import { combineReducers } from 'redux';
import likeReducer from './likeReducer';
import playStateReducer from './playStateReducer';
import accessTokenReducer from './accessTokenReducer';
import refreshTokenReducer from './refreshTokenReducer';
import shuffleReducer from './shuffleReducer';
import isAuthenticatedReducer from './isAuthenticatedReducer';
import topSongReducer from './topSongReducer';
import queryReducer from './queryReducer';
import queryResultsReducer from './queryResultsReducer';
import timerReducer from './timerReducer';
import isSearchBarVisibleReducer from './isSearchBarVisibleReducer';

export default combineReducers({
  likesCurrentSong: likeReducer,
  playState: playStateReducer,
  access_token: accessTokenReducer,
  refresh_token: refreshTokenReducer,
  shuffle_state: shuffleReducer,
  isAuthenticatedReducer,
  topSongReducer,
  queryReducer,
  queryResultsReducer,
  timerReducer,
  isSearchBarVisibleReducer,
});
