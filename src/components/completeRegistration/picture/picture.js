import React, {Component, Fragment} from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {connect} from "react-redux";
import {withRouter} from "react-router";

import styles from './picture.scss';
import univStyles from '../../home/styles.scss';

import Button from '../../button/button'
import Cropper from './cropper/cropper';

import avatar from '../../../assets/ui/avatar.svg';

//import actionCreators
import { uploadImage, clickedUploadImage, editCroppedImage, replaceProgress } from "../../../store/actions/completeRegistration/completeRegistration";

import {employees, publicFolder} from "../../../api";

class Picture extends Component {
  state = {
    croppedImage: null,
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

  componentDidMount = () => {
    axios.get(employees.avatar + this.props.employeeId)
      .then(res => {
        if(res.data.data != null) {
          this.setState({croppedImage: publicFolder.images + res.data.data}, () => {
            if(this.props.progress < 20) {
              this.props.replaceProgress(20, this.props.employeeId)
            }
          })
        }
      });
  };

  onEdit = () => {
    if(this.props.rawImage != null) {
      this.props.edit();
    } else {
      this.refs.image.click()
    }
  };

  onSave = () => {
    if(this.props.croppedImage == null) {
      this.props.history.push('/complete-registration/personal-data-sheet')
    } else {
      const dataURItoBlob = dataURI => {
        const byteString = atob(dataURI.split(',')[1]);

        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
      };

      const image = dataURItoBlob(this.state.croppedImage);

      const formData = new FormData();

      formData.append('image', image);
      formData.append('employeeId', this.props.employeeId);

      axios.post('http://localhost:4000/employees/avatar', formData)
        .then(() => {
          if(this.props.progress < 20) {
            this.props.replaceProgress(20, this.props.employeeId)
          }

          this.props.history.push('/complete-registration/personal-data-sheet')
        })
    }
  };

  static getDerivedStateFromProps = (props, currentState) => {
    if(props.croppedImage !== currentState.croppedImage && props.croppedImage != null) {
      return {croppedImage: props.croppedImage}
    } return null
  };

  render() {
    const pictureTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Choose your picture</p>
      </div>;

    const bottomBar =
      <div className={univStyles.titleBar + ' ' + univStyles.singleButton + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <Button disabled={!this.state.croppedImage} onClick={this.onSave} width={70} classNames={['tertiary']} name="PROCEED"/>
      </div>;

    return (
      <Fragment>
        {pictureTitleBar}
        {bottomBar}
        {
          this.props.showModal ?
            createPortal(<Cropper/>, document.getElementById('root')) :
            null
        }
        <div className={univStyles.main}>
          <div className={univStyles.pageMain}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>First, let's choose a picture</p>
              </div>
              <div className={univStyles.formBody} style={{marginBottom: 50}}>
                <div className={styles.picture}>
                  {
                    this.props.clicked ?
                      this.refs.image.click() :
                      null
                  }
                  <div className={styles.container}>
                    {
                      this.state.croppedImage ?
                        <Fragment>
                          <img src={this.state.croppedImage} height={200} alt=""/>
                          <p><span onClick={this.onEdit}>
                            {
                              !this.state.changeImage ?
                                'Edit or change' :
                                'Change'
                            }
                          </span> your image</p>
                        </Fragment> :
                        <Fragment>
                          <img src={avatar} height={200} alt=""/>
                          <p><span onClick={this.props.clickedUploadImage}>Browse</span> for an image</p>
                        </Fragment>
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
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    clicked: state.completeRegistration.picture.ui.clickedUploadImage,
    croppedImage: state.completeRegistration.picture.croppedImage,
    showModal: state.completeRegistration.picture.ui.showModal,
    employeeId: state.authentication.employeeId,
    rawImage: state.completeRegistration.picture.rawImage,
    progress: state.completeRegistration.progress
  }
};

const mapDispatchToProps = dispatch => {
  return {
    uploadImage: image => dispatch(uploadImage(image)),
    clickedUploadImage: () => dispatch(clickedUploadImage()),
    edit: () => dispatch(editCroppedImage()),
    replaceProgress: (value, employeeId) => dispatch(replaceProgress(value, employeeId))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Picture));
