import { createPortal } from 'react-dom';
import React from 'react';

const deleteConfirmationModal = props => {
  const root = document.getElementById('root');

  return createPortal(props.children, root)
};

export default deleteConfirmationModal;
