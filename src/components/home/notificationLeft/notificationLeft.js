import React, {Component} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import produce from 'immer';

import styles from './notificationLeft.scss';

class NotificationLeft extends Component {
  state = {
    notifications: [],
  };

  componentDidMount = () => {

  };

  timers = {};

  addNotification = () => {
    this.setState(produce(draft => {
      draft.notifications.push('haha')
    }), () => {
      const arrayLength = this.state.notifications.length - 1;

      this.timers[arrayLength.toString()] = setTimeout(() => {
        this.setState(produce(draft => {
          draft.notifications.splice(arrayLength, 1)
        }))
      }, 10000);
    })
  };

  pauseTimeout = i => {
    clearTimeout(this.timers[i.toString()]);
  };

  resumeTimeout = i => {
    this.timers[i.toString()] = setTimeout(() => {
      this.setState(produce(draft => {
        draft.notifications.splice(i, 1)
      }))
    }, 10000);
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
        <div onMouseOut={() => this.resumeTimeout(index)} onMouseOver={() => this.pauseTimeout(index)} className={styles.notification}>
          <p>{index}</p>
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

export default NotificationLeft;
