import React from 'react';

import styles from './alert.scss'

const alert = props =>
  <div className={styles[props.type] + ' ' + styles.alert}>
    <p>{props.message}</p>
  </div>;
  
export default alert;
