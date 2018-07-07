import React from 'react';

import styles from './sideBar.scss';

const sideBar = props =>
  <div className={styles.sideBar}>
    {props.children}
  </div>;

export default sideBar;
