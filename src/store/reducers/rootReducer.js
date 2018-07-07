import { combineReducers } from 'redux';

import authentication from './authentication';
import completeRegistration from './completeRegistration';
import ui from './ui';

const rootReducer = combineReducers({
  authentication,
  completeRegistration,
  ui
});

export default rootReducer;