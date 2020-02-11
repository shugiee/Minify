import { combineReducers } from 'redux';
import likeReducer from './likeReducer';
import playStateReducer from './playStateReducer';
import accessTokenReducer from './accessTokenReducer';
import refreshTokenReducer from './refreshTokenReducer';
import shuffleReducer from './shuffleReducer';

export default combineReducers({
  likesCurrentSong: likeReducer,
  playState: playStateReducer,
  access_token: accessTokenReducer,
  refresh_token: refreshTokenReducer,
  shuffle_state: shuffleReducer,
});
