import React, {Component} from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import styles from './toaster.scss';

class Toaster extends Component {
  render() {
    const toasts = this.props.toasts.map(toast => (
      <CSSTransition
        timeout={200}
        classNames={{
          enter: styles.enter,
          enterActive: styles.enterActive,
          exit: styles.exit,
          exitActive: styles.exitActive
        }}
        key={toast.key}>
        <div className={styles.toast}>
          <p>{toast.message}</p>
        </div>
      </CSSTransition>
    ));

    return(
      <div className={styles.container}>
        <TransitionGroup>
          {toasts}
        </TransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    toasts: state.ui.toasts
  }
};

export default connect(mapStateToProps)(Toaster);
