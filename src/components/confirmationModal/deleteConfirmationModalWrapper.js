import { createPortal } from 'react-dom';
import React from 'react';

const deleteConfirmationModalWrapper = props => {
  const app = document.getElementById('app');
  return createPortal(props.children, app)
};

export default deleteConfirmationModalWrapper;
