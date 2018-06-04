import { combineReducers } from 'redux';
import authenticationReducer from './authentication';

const rootReducer = combineReducers({
  authentication: authenticationReducer
});

export default rootReducer;