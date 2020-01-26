import { combineReducers } from 'redux';
import likeReducer from './likeReducer';

export default combineReducers({
  like: likeReducer,
});
