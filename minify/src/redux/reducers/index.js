import { combineReducers } from 'redux';
import likeReducer from './likeReducer';
import playStateReducer from './playStateReducer';

export default combineReducers({
  like: likeReducer,
  playState: playStateReducer,
});
