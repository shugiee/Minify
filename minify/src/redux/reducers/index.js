import { combineReducers } from 'redux';
import likeReducer from './likeReducer';
import playStateReducer from './playStateReducer';
import accessTokenReducer from './accessTokenReducer';
import refreshTokenReducer from './refreshTokenReducer';

export default combineReducers({
  likesCurrentSong: likeReducer,
  playState: playStateReducer,
  access_token: accessTokenReducer,
  refresh_token: refreshTokenReducer,
});
