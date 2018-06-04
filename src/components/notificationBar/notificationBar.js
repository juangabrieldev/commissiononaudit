import React, {Component} from 'react';

import styles from './notificationBar.scss';

class NotificationBar extends Component {
  state = {};

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.notification}>
          <p className={styles.from}>Promotion Management System</p>
        </div>
      </div>
    );
  }
}

export default NotificationBar;
