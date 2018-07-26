import produce from 'immer';
import { store } from '../../index';

import * as actions from '../actions/ui/actions';

const initialState = {
  showAvatarDropdown: false,
  blockNavigation: false,
  blockNavigationMessage: ''
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actions.TOGGLE_AVATAR_DROPDOWN: {
      return {
        ...state,
        showAvatarDropdown: !state.showAvatarDropdown
      }
    }

    case actions.BLOCK_NAVIGATION: {
      return {
        ...state,
        blockNavigation: action.payload.value,
        blockNavigationMessage: action.payload.message
      }
    }

    default:
      return state;
  }
};

export default reducer;