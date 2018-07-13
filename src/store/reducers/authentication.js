import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';

import * as actions from '../actions/authentication/actions';

// mode 1 - logged out
// mode 2 - verify
// mode 3 - completeRegistration
// mode 4 - logged in
// mode 5 - choose role

let initialState = {
  mode: 1,
  role: null,
  isAuthenticating: false,
  authenticationSuccessful: null,
  authenticationMessage: null,
  doneAuthenticating: false,
  keepMeLoggedIn: false,
  firstName: null,
  lastName: null,
  middleInitial: null,
  email: null
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
        authenticationSuccessful: action.payload.success,
        authenticationMessage: action.payload.message,
        notYetRegisteredEmployeeId: action.payload.notYetRegisteredEmployeeId,
        isAuthenticating: false
      };
    }

    case actions.CHECK_AUTHENTICATION: {
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        middleInitial: action.payload.middleInitial,
        mode: action.payload.mode,
        role: action.payload.role,
        email: action.payload.email
      };
    }

    case actions.REGISTER: {
      return {
        ...state,
        isAuthenticating: true
      };
    }

    case actions.RESET: {
      return {
        mode: 1,
        role: null,
        isAuthenticating: false,
        authenticationSuccessful: null,
        authenticationMessage: null,
        doneAuthenticating: false,
        keepMeLoggedIn: false,
        firstName: null,
        lastName: null,
        middleInitial: null,
        email: null
      }
    }

    case actions.KEEP_ME_LOGGED_IN_TOGGLE: {
      return {
        ...state,
        keepMeLoggedIn: action.v
      }
    }

    case actions.LOG_OUT: {
      return {
        mode: 1,
        isAuthenticating: false,
        authenticationSuccessful: null,
        authenticationMessage: null,
        doneAuthenticating: false,
        keepMeLoggedIn: false,
        firstName: null,
        lastName: null,
        email: null
      }
    }

    default:
      return state;
  }
};

export default reducer;