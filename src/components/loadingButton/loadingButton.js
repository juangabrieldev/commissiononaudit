import React from 'react';
import Spin from 'react-md-spinner';

import styles from './loadingButton.scss';

const loadingButton = props =>
  <div className={`${styles.loadingButton} ${styles.primary} ` + (props.complete ? `${styles.complete}` : '')} style={{width: props.width}}>
    {
      !props.complete ?
        <Spin size={18} singleColor="#fff"/> :
        <p>{props.completeMessage}</p>
    }
  </div>;

export default loadingButton;
