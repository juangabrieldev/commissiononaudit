import produce from 'immer';
import { store } from '../../index';

import * as actions from '../actions/ui/actions';

const initialState = {
  showAvatarDropdown: false,
  showNotificationDropdown: false,
  blockNavigation: false,
  blockNavigationMessage: '',
  toasts: [],
  notFound: false,
  notFoundHome: null
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
        draft.toasts.push({
          message: action.payload.message,
          key: action.payload.key
        })
      });
    }

    case actions.REMOVE_TOAST: {
      return produce(state, draft => {
        draft.toasts.splice(0, 1)
      });
    }

    case actions.ENABLE_NOT_FOUND: {
      return {
        ...state,
        notFound: true,
        notFoundHome: action.payload.link
      }
    }

    case actions.DISABLE_NOT_FOUND: {
      return {
        ...state,
        notFound: false,
        notFoundHome: null
      }
    }

    default:
      return state;
  }
};

export default reducer;