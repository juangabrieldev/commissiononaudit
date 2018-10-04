import React from 'react';
import Spin from 'react-md-spinner';

import styles from './styles.scss';

const modal = () => (
  <div className={styles.background}>
    <div className={styles.form}>
      <div className={styles.header}>
        <p>Uploading your files</p>
      </div>
      <div className={styles.formBody}>
        <div>
          <Spin size={22} singleColor="#4688ff"/>
          <p>Please wait...</p>
        </div>
      </div>
    </div>
  </div>
);

export default modal;
