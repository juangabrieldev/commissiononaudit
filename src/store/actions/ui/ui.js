import * as actions from './actions'

export const addToast = message => dispatch => {
  dispatch({type: actions.ADD_TOAST, payload: {message}});
  setTimeout(() => {
    dispatch({type: actions.REMOVE_TOAST});
  }, 7000)
};