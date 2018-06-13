import { combineReducers } from 'redux';

import authentication from './authentication';
import completeRegistration from './completeRegistration';

const rootReducer = combineReducers({
  authentication,
  completeRegistration,
});

export default rootReducer;