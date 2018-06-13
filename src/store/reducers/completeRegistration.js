import produce from 'immer';

import * as actions from '../actions/completeRegistration/actions';

const initialState = {
  progress: 0,
  picture: {
    oldRawImage: null,
    rawImage: null,
    croppedImage: null,
    oldCroppedImage: null,
    canvasData: null,
    ui: {
      clickedUploadImage: false,
      showModal: false
    }
  },
  personalDataSheet: {

  },
};

const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch(action.type) {
      case actions.CLICKED_UPLOAD_IMAGE:
        draft.picture.ui.clickedUploadImage = true;
        break;

      case actions.CLICKED_UPLOAD_IMAGE_DONE:
        draft.picture.ui.clickedUploadImage = false;
        break;

      case actions.UPLOAD_IMAGE:
        draft.picture.rawImage = action.payload.rawImage;

        draft.picture.ui.showModal = true;
        break;

      case actions.STORE_UPLOADED_IMAGE:
        draft.picture.oldRawImage = action.payload.rawImage;
        break;

      case actions.CANCEL_UPLOAD_IMAGE:
        draft.picture.rawImage = null;
        draft.picture.ui.showModal = false;
        break;

      case actions.CROPPED_IMAGE:
        // return {
        //   ...state,
        //   picture: {
        //     ...state.picture,
        //     croppedImage: action.payload.croppedImage,
        //     oldCroppedImage: action.payload.croppedImage,
        //     ui: {
        //       showModal: false
        //     }
        //   },
        // };
        draft.picture.canvasData = action.payload.canvasData;
        draft.picture.oldRawImage = action.payload.oldRawImage;
        draft.picture.croppedImage = action.payload.croppedImage;
        draft.picture.ui.showModal = false;
        break;

      case actions.EDIT_CROPPED_IMAGE:
        // return {
        //   ...state,
        //   picture: {
        //     ...state.picture,
        //     ui: {
        //       showModal: true
        //     }
        //   }
        // };
        draft.picture.rawImage = state.picture.oldRawImage;
        draft.picture.ui.showModal = true;
    }
  });

export default reducer;