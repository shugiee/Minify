import { combineReducers } from 'redux';
import likeReducer from './likeReducer';

export default combineReducers({
  likesCurrentSong: likeReducer,
});
