import produce from 'immer';
import { store } from '../../index';

import * as actions from '../actions/ui/actions';

const initialState = {
  showAvatarDropdown: false,
  blockNavigation: false,
  blockNavigationMessage: '',
  toasts: []
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

    case actions.ADD_TOAST: {
      return produce(state, draft => {
        draft.toasts.push(action.payload.message)
      });
    }

    case actions.REMOVE_TOAST: {
      return produce(state, draft => {
        draft.toasts.splice(0, 1)
      });
    }

    default:
      return state;
  }
};

export default reducer;