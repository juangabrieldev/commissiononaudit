import React, {Component} from 'react';

import Aux from '../auxillary/auxillary';
import Progress from './progressBar/progressBar'
import SideBar from './sideBar/sideBar';
import Picture from './picture/picture';

import styles from './completeRegistration.scss';

class CompleteRegistration extends Component {
  state = {};

  render() {
    return (
      <Aux>
        <div className={styles.top}>
          <Progress />
        </div>
        <div className={styles.middle}>
          <div className={styles.container}>
            <div>
              <div className={styles.sideBar}>
                <SideBar/>
              </div>
            </div>
            <div className={styles.form}>
              <Picture />
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

export default CompleteRegistration;
