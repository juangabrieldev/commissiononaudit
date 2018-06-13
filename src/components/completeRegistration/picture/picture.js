import React, {Component} from 'react';
import Cropper from 'react-cropper';

import styles from './picture.scss';

import Button from '../../button/button'
import Aux from '../../auxillary/auxillary';

import avatar from '../../../assets/ui/avatar.svg';

//import actionCreators
import { uploadImage, clickedUploadImage, editCroppedImage } from "../../../store/actions/completeRegistration/completeRegistration";
import {connect} from "react-redux";

class Picture extends Component {
  state = {
    croppedImage: null
  };

  onImageChangeHandler = () => {
    const reader = new FileReader();
    reader.readAsDataURL(this.refs.image.files[0]);

    reader.onloadend = () => {
      if(this.refs.image.files[0].size <= 3000000) {
        this.props.uploadImage(reader.result);
      } else {
        alert('File size is too big')
      }
    }
  };

  static getDerivedStateFromProps = (props, currentState) => {
    if(props.croppedImage !== currentState.croppedImage) {
      return {croppedImage: props.croppedImage}
    } return null
  };

  render() {
    return (
      <div className={styles.form}>
        {
          this.props.clicked ?
            this.refs.image.click() :
            null
        }
        <div className={styles.title}>
          <p><strong>Choose</strong> your picture</p>
        </div>
        <div className={styles.container}>
          {
            this.state.croppedImage ?
              <Aux>
                <img src={this.state.croppedImage} height={200} alt=""/>
                <p><span onClick={this.props.edit}>Edit or change</span> your image</p>
              </Aux> :
              <Aux>
                <img src={avatar} height={200} alt=""/>
                <p><span onClick={() => this.props.clickedUploadImage()}>Browse</span> for an image</p>
              </Aux>
          }
          <input
            accept=".png, .jpg, .jpeg"
            type="file"
            ref="image"
            onChange={this.onImageChangeHandler}/>
        </div>
        <div className={styles.bottom}>
          <div className={styles.helper}>
            <p>*The picture you upload will be attached to your Personal Data Sheet.</p>
            <p>*Rounded image is only for preview.</p>
          </div>
          <div className={styles.button}>
            <Button
              width={100}
              name="Next"
              classNames={['primary']}
              disabled={!this.props.croppedImage}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    clicked: state.completeRegistration.picture.ui.clickedUploadImage,
    croppedImage: state.completeRegistration.picture.croppedImage
  }
};

const mapDispatchToProps = dispatch => {
  return {
    uploadImage: image => dispatch(uploadImage(image)),
    clickedUploadImage: () => dispatch(clickedUploadImage()),
    edit: () => dispatch(editCroppedImage())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Picture);
