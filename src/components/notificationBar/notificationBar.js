import React, {Component} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import produce from 'immer';

import styles from './notificationBar.scss';

class NotificationBar extends Component {
  state = {
    notifications: [],
  };

  render() {
    const notifications = this.state.notifications.map((notification, index) => (
      <CSSTransition
        timeout={300}
        classNames={{
          enter: styles.enter,
          enterActive: styles.enterActive,
          exit: styles.exit,
          exitActive: styles.exitActive
        }}>
        <div className={styles.notification}>
        </div>
      </CSSTransition>
      ));

    return (
      <div className={styles.container}>
        <TransitionGroup component={null}>
          {notifications}
        </TransitionGroup>
      </div>
    );
  }
}

export default NotificationBar;
