import * as actions from '../actions/authentication/actions';

const initialState = {
  token: '',
  loggedIn: false,
  firstName: '',
  lastName: '',
  userType: ''
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actions.LOG_IN:
      return {
        token: action.payload.token
      };

    default:
      return state;
  }
};

export default reducer;