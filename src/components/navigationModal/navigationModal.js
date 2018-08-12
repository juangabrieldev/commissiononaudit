import React from 'react';

import styles from './navigationModal.scss';

import Button from '../button/button';

const navigationModal = ({onCancel, onConfirm, message}) =>
  <div className={styles.background}>
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
      <div className={styles.form}>
        <div className={styles.header}>
          <p>Leave the page?</p>
        </div>
        <div className={styles.formBody}>
          <p>{message}</p>
          <div className={styles.footer}>
            <Button classNames={['cancel']} onClick={onCancel} name="STAY ON THIS PAGE"/>
            <Button classNames={['primary']} onClick={onConfirm} name="LEAVE THIS PAGE"/>
          </div>
        </div>
      </div>
    </div>
  </div>;


export default navigationModal;
