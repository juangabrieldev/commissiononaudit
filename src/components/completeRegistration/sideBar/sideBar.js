import React, {Component} from 'react';

import styles from './sideBar.scss';

import check from '../../../assets/ui/checked.svg';

class SideBar extends Component {
  state = {};

  render() {
    return (
      <div className={styles.sidebar}>
        <div className={styles.registrationTitle}>
          <p className={styles.title}>Complete your registration</p>
          <p className={styles.details}>Lorem ipsum dolor sit amet, consectetur adipisicing </p>
        </div>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.active}`}>
            <div className={styles.selector}/>
            <p>Choose your picture</p>
            <img src={check} height={14} alt=""/>
          </div>
          <div className={styles.tab}>
            <div className={styles.selector}/>
            <p>Personal Data Sheet</p>
          </div>
        </div>
      </div>
    );
  }
}

export default SideBar;
