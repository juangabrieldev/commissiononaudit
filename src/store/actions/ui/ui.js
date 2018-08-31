import * as actions from './actions'
import uuidv1 from 'uuid/v1';

export const addToast = message => dispatch => {
  dispatch({type: actions.ADD_TOAST, payload: {message, key: uuidv1()}});
  setTimeout(() => {
    dispatch({type: actions.REMOVE_TOAST});
  }, 7000)
};