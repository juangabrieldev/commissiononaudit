import produce from 'immer';
import { store } from '../../index';

import * as actions from '../actions/ui/actions';

const initialState = {
  showAvatarDropdown: false
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actions.TOGGLE_AVATAR_DROPDOWN: {
      return {
        ...state,
        showAvatarDropdown: !state.showAvatarDropdown
      }
    }

    default:
      return state;
  }
};

export default reducer;