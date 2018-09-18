import React from 'react';
import { createPortal } from 'react-dom';

const portal = props => (
  createPortal(props.children, document.getElementById('root'))
);

export default portal;
