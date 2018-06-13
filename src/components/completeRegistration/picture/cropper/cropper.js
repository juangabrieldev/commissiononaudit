import React, {Component} from 'react';
import ReactCropper from 'react-cropper';
import { connect } from 'react-redux';

import Button from '../../../button/button';

import styles from './styles.scss'
import './cropper.scss';

import { cancelUploadImage, clickedUploadImage, croppedImage } from "../../../../store/actions/completeRegistration/completeRegistration";

class Cropper extends Component {
  state = {
    zoom: 0
  };

  saveHandler = () => {
    const canvasData = this.refs.crop.getData();
    this.props.save(this.refs.crop.getCroppedCanvas().toDataURL(), canvasData)
  };

  render() {
    return (
      <div className={styles.crop}>
        <div className={styles.form}>
          <div className={styles.title}>
            <p><strong>Crop</strong> your image</p>
          </div>
          <div className={styles.container}>
            <div className={styles.top}>
              <ReactCropper
                ref="crop"
                src={this.props.rawImage}
                style={{
                  height: 300,
                  width: 400,
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
                viewMode={2}
                background={false}
                aspectRatio={1}
                dragMode="move"
                preview={'.' + styles.preview}
                data={this.props.canvasData}
              />
              <div className={styles.previewContainer}>
                <p>Preview</p>
                <div className={styles.preview} />
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.change}>
              <Button
                width={120}
                classNames={['tertiary']}
                name="Change picture"
                onClick={this.props.clickedUploadImage}/>
            </div>
            <div className={styles.right}>
              <Button
                width={80}
                classNames={['tertiary']}
                name="Cancel"
                onClick={this.props.cancel}/>
              <Button
                width={80}
                classNames={['primary']}
                name="Save"
                onClick={this.saveHandler}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rawImage: state.completeRegistration.picture.rawImage,
    canvasData: state.completeRegistration.picture.canvasData
  }
};

const mapDispatchToProps = dispatch => {
  return {
    cancel: () => dispatch(cancelUploadImage()),
    clickedUploadImage: () => dispatch(clickedUploadImage()),
    save: (image, data) => dispatch(croppedImage(image, data))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Cropper);