import React from 'react';

import styles from './sideBar.scss';

const sideBar = props =>
  <div className={styles.sideBar}>
    <div className={styles.header}>
      <p>SECTIONS</p>
    </div>
    {props.children}
  </div>;

export default sideBar;
