import React, {Component} from 'react';
import { connect } from 'react-redux';

import Aux from '../auxillary/auxillary';
import Cropper from '../completeRegistration/picture/cropper/cropper';
import Progress from './progressBar/progressBar'
import SideBar from './sideBar/sideBar';
import Picture from './picture/picture';

import styles from './completeRegistration.scss';

class CompleteRegistration extends Component {
  state = {};

  render() {
    return (
      <Aux>
        {
          this.props.showModal ?
            <Cropper/> :
            null
        }
        <div className={styles.top}>
          <Progress progress={this.props.progress} />
        </div>
        <div className={styles.middle}>
          <div className={styles.container}>
            <div className={styles.sideBarContainer}>
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

const mapStateToProps = state => {
  return {
    progress: state.completeRegistration.progress,
    rawImage: state.completeRegistration.picture.rawImage,
    croppedImage: state.completeRegistration.picture.croppedImage,
    showModal: state.completeRegistration.picture.ui.showModal
  }
};

export default connect(mapStateToProps)(CompleteRegistration);
