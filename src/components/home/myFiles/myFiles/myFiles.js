import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import axios from 'axios';
import _ from 'lodash';
import fileExtension from 'file-extension';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import {Col, Container, Row} from "react-grid-system";
import ReactSVG from "react-svg";
import jobIcon from "../../../../assets/ui/jobs.svg";

import Button from "../../../button/button";

import { applications } from "../../../../api";

class MyFiles extends Component {
  state = {
    fileContainers: [
      {
        name: 'Application letter',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Diploma',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: 'image/*'
      },
      {
        name: 'Memorandum of recommendation',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.xlsx, .xls'
      },
      {
        name: 'Performance ratings 1',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.xlsx, .xls'
      },
      {
        name: 'Performance ratings 2',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.xlsx, .xls'
      },
      {
        name: 'Position description form',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.xlsx, .xls'
      },
      {
        name: 'Sworn statement',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Training certificate',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Work experience',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Work Assignment history',
        fileName: null,
        fileSize: null,
        isValid: false,
        accept: '.docx, .doc'
      }
    ],
    files: {}
  };

  componentDidMount = () => {
    axios.get(applications.files + this.props.employeeId)
      .then(res => {
        this.setState({files: res.data.data[0].details.files});
      })
  };

  downloadFile = url => {
    window.location.replace(`http://localhost:4000/documents/${url}`)
  };

  render() {
    const myFilesTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>
          My files
        </p>
      </div>;

    const fileContainers = this.state.fileContainers.map(file => {
      return (
        <div className={styles.fileContainer}>
          <div className={styles.iconContainer}>
            {
              this.state.files[_.camelCase(file.name)] ?
                <p className={styles.fileType + ` ${fileExtension(this.state.files[_.camelCase(file.name)].localFilePath)}`}>
                  { '.' + fileExtension(this.state.files[_.camelCase(file.name)].localFilePath) }
                </p> :
                null
            }
          </div>
          <div>
            <p className={styles.uploadContainerName}>{ file.name }</p>
          </div>
          <Button
            onClick={() => this.downloadFile(this.state.files[_.camelCase(file.name)].localFilePath)}
            classNames={['tertiary']}
            name="DOWNLOAD FILE"/>
        </div>
      )
    });

    return (
      <Fragment>
        {myFilesTitleBar}
        <div className={univStyles.main}>
          <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
          <div className={univStyles.pageMain}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>
                  Recent files
                </p>
              </div>
              <div className={univStyles.formBody} style={{padding: 15, position: 'relative'}}>
                { fileContainers }
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.authentication.role,
    employeeId: state.authentication.employeeId
  }
};

export default withRouter(connect(mapStateToProps)(MyFiles));

