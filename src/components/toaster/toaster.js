import React, {Component} from 'react';
import { connect } from 'react-redux';

import styles from './toaster.scss';

class Toaster extends Component {
  render() {
    const toasts = this.props.toasts.map(toast => (
      <div className={styles.toast}>
        <p>{toast}</p>
      </div>
    ));

    return(
      <div className={styles.container}>
        <div>
          {toasts}
        </div>
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
