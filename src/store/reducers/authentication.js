import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';

import * as actions from '../actions/authentication/actions';

// mode 1 - logged out
// mode 2 - verify
// mode 3 - completeRegistration
// mode 4 - logged in

let initialState = {
  mode: 1,
  isAuthenticating: false,
  authenticationSuccessful: null,
  doneAuthenticating: false,
  keepMeLoggedIn: false,
  firstName: null, // null
  lastName: null, // null
  email: null // null
};

const cookies = new Cookies();

const myCookies = cookies.get('session');

if(myCookies) {
  const tokenDecoded = jwt.decode(myCookies);

  initialState.firstName = tokenDecoded.firstName;
  initialState.lastName = tokenDecoded.lastName;
  initialState.mode = tokenDecoded.mode;
  initialState.email = tokenDecoded.email;
}

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
        doneAuthenticating: true,
        authenticationSuccessful: action.payload.success
      };
    }

    case actions.CHECK_AUTHENTICATION: {
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        mode: action.payload.mode,
        email: action.payload.email
      };
    }

    case actions.REGISTER: {
      return {
        ...state,
        isAuthenticating: true
      };
    }

    case actions.KEEP_ME_LOGGED_IN_TOGGLE: {
      return {
        ...state,
        keepMeLoggedIn: action.v
      }
    }

    default:
      return state;
  }
};

export default reducer;