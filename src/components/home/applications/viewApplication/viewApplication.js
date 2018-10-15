import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import { Container, Row, Col, setConfiguration } from 'react-grid-system';
import axios from 'axios';
import produce from 'immer';
import readExcel from 'read-excel-file';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import moment from "moment";

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import { applications, employees, documents } from "../../../../api";

import check from '../../../../assets/ui/check.svg';
import Button from "../../../button/button";
import Modal from './modal';
import Portal from '../../../portal/portal';

setConfiguration({ gutterWidth: 15 });

class Applications extends Component {
  state = {
    token: null,
    uploadContainers: [
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
    currentPage: 1,
    pages: 2,
    showModal: false,
    applicationTitle: null,

    isApplicationSubmitted: false,
    hasEvaluationStarted: false,
    isComplete: false,

    ratings: {
      first: null,
      second: null,
      average: null
    },

    applicationSubmitted: {
      applicationId: null,
      jobId: null,
      positionTitle: null,
      submittedTo: null,
      dateSubmitted: null
    },

    evaluationHasStarted: {
      byClusterEvaluatorName: null,
      dateOfStartOfEvaluation: null
    }
  };

  fetch = () => {
    const { token } = this.props.match.params;

    axios.get(applications.view + token + `?applicantId=${this.props.employeeId}`)
      .then(res => {
        const data = res.data.data;

        console.log(data);

        console.log(moment(data.dateofevaluation).format('MMMM DD YYYY h:mm'));

        this.setState(produce(draft => {
          draft.applicationTitle = data.applicationTitle;

          //set first point
          draft.applicationSubmitted.applicationId = data.token;
          draft.applicationSubmitted.jobId = data.jobid;
          draft.applicationSubmitted.positionTitle = data.jobtitle;
          draft.applicationSubmitted.submittedTo = data.byClusterEvaluatorName;
          draft.applicationSubmitted.dateSubmitted = data.dateofsubmission;

          //set second point
          draft.evaluationHasStarted.byClusterEvaluatorName = data.byClusterEvaluatorName;
          draft.evaluationHasStarted.dateOfStartOfEvaluation = data.dateofevaluation;

          //if the application has been already submitted
          if(!!data.dateofsubmission) {
            draft.isApplicationSubmitted = true
          }

          if(!!data.dateofevaluation) {
            draft.hasEvaluationStarted = true
          }
        }));
      })
  };

  componentDidMount = () => {
    this.fetch();
  };

  onChangeUploadContainer = i => {
    const notValid = () => {
      alert('Please upload a valid Performance sheet.');

      this.refs[this.state.uploadContainers[i].name].value = null;

      this.setState(produce(draft => {
        draft.uploadContainers[i].isValid = false
      }));
    };

    if(this.refs[this.state.uploadContainers[i].name].value) {
      const fileName = this.refs[this.state.uploadContainers[i].name].files[0].name;
      const fileSize = this.refs[this.state.uploadContainers[i].name].files[0].size;

      if(i === 3 || i === 4) {
        readExcel(this.refs[this.state.uploadContainers[i].name].files[0])
          .then(rows => {
            const index = _.findIndex(rows, o => {
              return o[0] === 'Final Rating:'
            });

            if(index < 0) {
              notValid();
            } else {
              //if out of range
              if(rows[index][1] <= 5 && rows[index][1] >= 0) {
                const first = this.refs[this.state.uploadContainers[3].name].files[0];
                const second = this.refs[this.state.uploadContainers[4].name].files[0];

                if(first && second) {
                  if(first.lastModified === second.lastModified) {
                    notValid()
                  } else {
                    this.setState(produce(draft => {
                      //switch between performance ratings
                      switch(i) {
                        case 3: {
                          draft.ratings.first = rows[index][1];
                          break;
                        }

                        case 4: {
                          draft.ratings.second = rows[index][1];
                        }
                      }

                      draft.uploadContainers[i].isValid = true;
                      draft.uploadContainers[i].fileName = fileName;
                      draft.uploadContainers[i].fileSize = fileSize;
                    }));
                  }
                } else {
                  this.setState(produce(draft => {
                    //switch between performance ratings
                    switch(i) {
                      case 3: {
                        draft.ratings.first = rows[index][1];
                        break;
                      }

                      case 4: {
                        draft.ratings.second = rows[index][1];
                      }
                    }

                    draft.uploadContainers[i].isValid = true;
                    draft.uploadContainers[i].fileName = fileName;
                    draft.uploadContainers[i].fileSize = fileSize;
                  }));
                }
              } else {
                notValid()
              }
            }
          })
          .catch(notValid)
      } else {
        this.setState(produce(draft => {
          draft.uploadContainers[i].isValid = true;
          draft.uploadContainers[i].fileName = fileName;
          draft.uploadContainers[i].fileSize = fileSize;
        }));
      }
    } else {
      this.setState(produce(draft => {
        draft.uploadContainers[i].isValid = false;
        draft.uploadContainers[i].fileName = null;
        draft.uploadContainers[i].fileSize = null;
      }));
    }
  };

  onNext = () => {
    if(this.state.currentPage === 1) {
      const files = new FormData();

      this.state.uploadContainers.forEach(con => {
        const name = _.camelCase(con.name);

        files.append(name, this.refs[con.name].files[0]);
      });

      files.append('applicationId', this.props.match.params.token);
      files.append('firstRating', this.state.ratings.first.toString());
      files.append('secondRating', this.state.ratings.second.toString());
      files.append('averageRating', ((this.state.ratings.first + this.state.ratings.second) / 2).toString());

      this.setState({showModal: true});

      axios.post(documents.post, files)
        .then(() => {
          this.setState({showModal: false}, this.fetch)
        });
    }
  };

  render() {
    const applicationsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Application for {this.state.applicationSubmitted.positionTitle}</p>
      </div>;

    const bottomBarNextTitle = this.state.currentPage === this.state.pages ? 'SAVE' : 'UPLOAD';

    let uploadDisabled = false;

    this.state.uploadContainers.forEach(con => {
      if(!con.isValid) {
        uploadDisabled = true
      }
    });

    const bottomBar =
      <div
        className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <p style={{fontSize: 16}}>Page {this.state.currentPage} of {this.state.pages}</p>
        <div style={{marginLeft: 'auto', marginRight: 15}}>
          {
            this.state.currentPage === 2 ?
              <Button onClick={this.onGoBack} width={70} classNames={['cancel']} name="GO BACK"/> :
              null
          }
          <Button
            disabled={uploadDisabled}
            style={{marginLeft: 15}}
            onClick={this.onNext}
            width={70}
            classNames={['tertiary']}
            name={bottomBarNextTitle}/>
        </div>
      </div>;

    const uploadContainers = this.state.uploadContainers.map((container, i) => {
      return (
        <div className={styles.uploadContainer}>
          <input
            accept={container.accept}
            onChange={() => this.onChangeUploadContainer(i)}
            ref={container.name}
            type="file"/>
          <div className={styles.iconContainer}>
          </div>
          <div>
            <p className={styles.uploadContainerName}>{ container.name }</p>
            <p className={styles.metaData}>
              {
                container.isValid ?
                  Math.round(container.fileSize / 1000) + ' KB' :
                  'File size'
              }
            </p>
            <p className={styles.metaData}>&#8226;</p>
            <p className={styles.metaData}>
              {
                container.isValid ?
                  container.fileName :
                  'File name'
              }
            </p>
          </div>
          {
            container.isValid ?
              <Button
                onClick={() => this.refs[container.name].click()}
                classNames={['tertiary']}
                name="CHANGE FILE"/> :
              <Button
                onClick={() => this.refs[container.name].click()}
                classNames={['primary']}
                name="UPLOAD FILE"/>
          }
        </div>
      )
    });

    const uploadDocuments =
      <div className={univStyles.form} style={{marginBottom: 50}}>
        <div className={univStyles.header}>
          <p>Upload documents</p>
        </div>
        <div className={univStyles.formBody} style={{padding: 15}}>
          { uploadContainers }
        </div>
      </div>;

    const applicationSubmittedTooltip =
      <ReactTooltip className={styles.tooltip} offset={{bottom: 10}} place="bottom" id="documents" effect="solid">
        <div className={styles.row}>
          <p style={{opacity: .5}}>Application ID:</p>
          <p>{this.state.applicationSubmitted.applicationId}</p>
        </div>
        <div className={styles.row}>
          <p style={{opacity: .5}}>Job ID:</p>
          <p>{ this.state.applicationSubmitted.jobId }</p>
        </div>
        <div className={styles.row}>
          <p style={{opacity: .5}}>Position title:</p>
          <p>{ this.state.applicationSubmitted.positionTitle }</p>
        </div>
        <div className={styles.row}>
          <p style={{opacity: .5}}>Submitted to:</p>
          <p>{ this.state.applicationSubmitted.submittedTo }</p>
        </div>
        <div className={styles.row}>
          <p style={{opacity: .5}}>Date submitted:</p>
          <p>
            { moment(this.state.applicationSubmitted.dateSubmitted).format('MMMM DD, YYYY') + ' at ' +
            moment(this.state.applicationSubmitted.dateSubmitted).format('h:mm A')
            }
          </p>
        </div>
      </ReactTooltip>;

    const evaluationHasStartedTooltip =
      <ReactTooltip className={styles.tooltip} offset={{bottom: 10}} place="bottom" id="evaluation" effect="solid">
        <div className={styles.row}>
          <p style={{opacity: .5}}>By-cluster evaluator:</p>
          <p>{this.state.evaluationHasStarted.byClusterEvaluatorName}</p>
        </div>
        <div className={styles.row}>
          <p style={{opacity: .5}}>Date submitted:</p>
          <p>
            { moment(this.state.evaluationHasStarted.dateOfStartOfEvaluation).format('MMMM DD, YYYY') + ' at ' +
            moment(this.state.evaluationHasStarted.dateOfStartOfEvaluation).format('h:mm A')
            }
          </p>
        </div>
      </ReactTooltip>;

    const applicationStatus =
      <div className={univStyles.form}>
        <div className={univStyles.header}>
          <p>Status of your application</p>
        </div>
        <div className={univStyles.formBody} style={{padding: 15}}>
          <div className={styles.applicationOverviewContainer}>
            <div className={styles.bigIconContainer}>
              <div>
                <img src={check} height={120} alt=""/>
              </div>
              <p className={styles.submitted}>Your application has been submitted.</p>
              <p className={styles.description}>You will receive a notification once the process is done.</p>
            </div>
            <div className={styles.timelineContainer}>
              <div className={styles.timeline}>
                <div className={styles.circle + ' ' + styles.blue} />
                <div className={styles.line + (this.state.hasEvaluationStarted ? ` ${styles.blue}` : '')}/>
                <div className={styles.circle + (this.state.hasEvaluationStarted ? ` ${styles.blue}` : '')} />
                <div className={styles.line}/>
                <div className={styles.circle + (this.state.isComplete ? ` ${styles.blue}` : '')} />
              </div>
              <div className={styles.textContainer}>
                <p data-event='click focus' data-tip="" data-for="documents" className={styles.black}>Application submitted</p>
                <p data-event='click focus' data-tip="" data-for="evaluation" className={this.state.hasEvaluationStarted ? styles.black : ''}>Evaluation has started</p>
                <p className={this.state.isComplete ? styles.black : ''}>Approval</p>
              </div>
            </div>
            { applicationSubmittedTooltip }
            { evaluationHasStartedTooltip }
          </div>
        </div>
      </div>;

    return (
      <Fragment>
        {
          this.state.showModal ?
            <Portal>
              <Modal/>
            </Portal> :
            null
        }
        { applicationsTitleBar }
        {
          !this.state.isApplicationSubmitted ?
            bottomBar :
            null
        }
        <div className={univStyles.main}>
          <div className={univStyles.pageMain}>
            {
              this.state.isApplicationSubmitted ?
                applicationStatus :
                uploadDocuments
            }
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

export default withRouter(connect(mapStateToProps)(Applications));

