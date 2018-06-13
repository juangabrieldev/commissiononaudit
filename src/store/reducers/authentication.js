import * as actions from '../actions/authentication/actions';

const initialState = {
  user: {
    token: '',
    loggedIn: false,
    firstName: '',
    lastName: '',
    userType: ''
  },
  isAuthenticating: false,
  authenticationSuccessful: null,
  doneAuthenticating: false
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actions.LOG_IN:
      return {
        ...state,
        isAuthenticating: true
      };

    case actions.AUTHENTICATION_DONE: {

      return {
        ...state,
        doneAuthenticating: true
      };
    }

    default:
      return state;
  }
};

export default reducer;