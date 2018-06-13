import * as actions from './actions';

export const logIn = (username, password) => dispatch => {
  dispatch({type: actions.LOG_IN});
  setTimeout(() => {
    dispatch({type: actions.AUTHENTICATION_DONE})
  }, 2000)
};