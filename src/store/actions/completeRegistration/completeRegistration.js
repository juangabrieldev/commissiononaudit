import { store } from '../../../index';
import * as actions from './actions';

export const uploadImage = rawImage => {
  return {
    type: actions.UPLOAD_IMAGE,
    payload: {
      rawImage,
    }
  }
};

export const clickedUploadImage = () => {
  return dispatch => {
    dispatch({type: actions.CLICKED_UPLOAD_IMAGE});
    setTimeout(() => {
      dispatch({type: actions.CLICKED_UPLOAD_IMAGE_DONE});
    }, 500)
  }
};

export const cancelUploadImage = () => {
  return {
    type: actions.CANCEL_UPLOAD_IMAGE,
  }
};

export const croppedImage = (croppedImage, canvasData) => {
  const oldRawImage = store.getState().completeRegistration.picture.rawImage;
  return {
    type: actions.CROPPED_IMAGE,
    payload: {
      croppedImage,
      oldRawImage,
      canvasData
    }
  }
};

export const editCroppedImage = () => {
  return {
    type: actions.EDIT_CROPPED_IMAGE,
  }
};