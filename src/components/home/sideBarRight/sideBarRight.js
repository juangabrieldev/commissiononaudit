import React, {Component} from 'react';

import styles from './sideBarRight.scss';

class SideBarRight extends Component {
  state = {};

  render() {
    return (
      <div className={styles.sideBar}>
        <div className={styles.systemLogs}>
          <div className={styles.header}>
            <p>SYSTEM LOGS</p>
          </div>
          <div className={styles.systemLogsItems}>
            <div className={styles.systemLogsItem}>
              <div className={styles.event}>
                <p><span>You</span> added a job and department.</p>
              </div>
              <div className={styles.time}>
                <p>Just now</p>
              </div>
            </div>
            <div className={styles.systemLogsItem}>
              <div className={styles.event}>
                <p><span>John Roderick</span> edited a <span>department.</span></p>
              </div>
              <div className={styles.time}>
                <p>36 minutes ago</p>
              </div>
            </div>
            <div className={styles.systemLogsItem}>
              <div className={styles.event}>
                <p><span>Lowell Jay</span> deleted an <span>employee.</span></p>
              </div>
              <div className={styles.time}>
                <p>1 hour ago</p>
              </div>
            </div>
            <div className={styles.systemLogsItem}>
              <div className={styles.event}>
                <p><span>Ram Jae</span> edited <span>employee's info.</span></p>
              </div>
              <div className={styles.time}>
                <p>2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SideBarRight;
