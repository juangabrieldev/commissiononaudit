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
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Diploma',
        isValid: false,
        accept: 'image/*'
      },
      {
        name: 'Memorandum of recommendation',
        isValid: false,
        accept: '.xlsx, .xls'
      },
      {
        name: 'Performance ratings',
        isValid: false,
        accept: '.xlsx, .xls'
      },
      {
        name: 'Position description form',
        isValid: false,
        accept: '.xlsx, .xls'
      },
      {
        name: 'Sworn statement',
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Training certificate',
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Work experience',
        isValid: false,
        accept: '.docx, .doc'
      },
      {
        name: 'Work Assignment history',
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
    rating: null,

    applicationSubmitted: {
      applicationId: null,
      jobId: null,
      positionTitle: null,
      submittedTo: null,
      dateSubmitted: null
    }
  };

  fetch = () => {
    const { token } = this.props.match.params;

    axios.get(applications.view + token + `?applicantId=${this.props.employeeId}`)
      .then(res => {
        const data = res.data.data;

        this.setState(produce(draft => {
          draft.applicationTitle = data.applicationTitle;

          //set first point
          draft.applicationSubmitted.applicationId = data.token;
          draft.applicationSubmitted.jobId = data.jobid;
          draft.applicationSubmitted.positionTitle = data.jobtitle;
          draft.applicationSubmitted.submittedTo = data.byClusterEvaluatorName;
          draft.applicationSubmitted.dateSubmitted = data.dateofsubmission;

          //if the application has been already submitted
          if(!!data.dateofsubmission) {
            draft.isApplicationSubmitted = true
          }
        }));
      })
  };

  componentDidMount = () => {
    this.fetch();
  };

  onClickUploadContainer = i => {
    this.refs[this.state.uploadContainers[i].name].click();
  };

  onChangeUploadContainer = i => {
    if(i === 3) {
      let isValid;
      let ratings = [];

      const fileList = this.refs[this.state.uploadContainers[i].name].files;

      if(fileList.length !== 2) {
        alert('Please upload your last two Performance ratings.');

        this.refs[this.state.uploadContainers[i].name].value = null;
        this.setState(produce(draft => {
          draft.uploadContainers[i].isValid = false
        }))
      } else {
        readExcel(fileList[0])
          .then(rows => {
            const index = _.findIndex(rows, o => {
              return o[0] === 'Final Rating:'
            });

            if(index < 0) {
              alert('Please upload a valid Performance ratings sheet');

              this.refs[this.state.uploadContainers[i].name].value = null;
              this.setState(produce(draft => {
                draft.uploadContainers[i].isValid = false
              }))
            } else {
              ratings.push(rows[index][1]);

              return readExcel(fileList[1])
            }
          })
          .then(rows => {
            const index = _.findIndex(rows, o => {
              return o[0] === 'Final Rating:'
            });

            if(index < 0) {
              alert('Please upload a valid Performance ratings sheet');

              this.refs[this.state.uploadContainers[i].name].value = null;
              this.setState(produce(draft => {
                draft.uploadContainers[i].isValid = false
              }))
            } else {
              ratings.push(rows[index][1]);

              console.log(ratings);

              if(ratings[0] != null && ratings[1] != null) {
                let average = (ratings[0] + ratings[1]) / 2;

                console.log(average);

                this.setState(produce(draft => {
                  draft.uploadContainers[i].isValid = true;
                  draft.rating = average;
                }))
              } else {
                alert('Please upload a valid Performance ratings sheet');

                this.refs[this.state.uploadContainers[i].name].value = null;
                this.setState(produce(draft => {
                  draft.uploadContainers[i].isValid = false
                }))
              }
            }
          })
          .catch(e => {
            alert('Please upload a valid Performance ratings sheet');

            this.refs[this.state.uploadContainers[i].name].value = null;
            this.setState(produce(draft => {
              draft.uploadContainers[i].isValid = false
            }))
          })
      }
    } else {
      this.setState(produce(draft => {
        draft.uploadContainers[i].isValid = true
      }))
    }
  };

  onNext = () => {
    if(this.state.currentPage === 1) {
      const files = new FormData();

      this.state.uploadContainers.forEach((con, i) => {
        const name = _.camelCase(con.name);

        if(i === 3) {
          files.append(name + '1', this.refs[con.name].files[0]);
          files.append(name + '2', this.refs[con.name].files[1]);
        } else {
          files.append(name, this.refs[con.name].files[0]);
        }
      });

      files.append('applicationId', this.props.match.params.token);
      files.append('rating', this.state.rating.toString());

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
      uploadDisabled = !con.isValid
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
        <Col xs={2} style={{marginTop: 15}}>
          <div
            onClick={() => this.onClickUploadContainer(i)}
            className={styles.uploadContainer + (container.isValid ? ' ' + styles.valid : '')}>
            <div className={styles.iconContainer}>
              <div className={styles.validity}>
                <img src={check} height={16} alt=""/>
              </div>
            </div>
            <input
              multiple={i === 3}
              accept={container.accept}
              onChange={() => this.onChangeUploadContainer(i)}
              ref={container.name}
              type="file"/>
            <div className={styles.bottom}>
              <p>{container.name}</p>
            </div>
          </div>
        </Col>
        )
  });

    const uploadDocuments =
      <div className={univStyles.form}>
        <div className={univStyles.header}>
          <p>Upload documents</p>
        </div>
        <div className={univStyles.formBody} style={{padding: 15}}>
          <Container fluid style={{padding: 0, marginTop: '-15px'}}>
            <Row>
              {uploadContainers}
            </Row>
          </Container>
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
          <p>{ moment(this.state.applicationSubmitted.dateSubmitted).calendar() }</p>
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
                <div className={styles.line + ' ' + styles.blue}/>
                <div className={styles.circle + (this.state.hasEvaluationStarted ? ` ${styles.blue}` : '')} />
                <div className={styles.line}/>
                <div className={styles.circle + (this.state.isComplete ? ` ${styles.blue}` : '')} />
              </div>
              <div className={styles.textContainer}>
                <p data-event='click focus' data-tip="" data-for="documents" className={styles.black}>Application submitted</p>
                <p className={this.state.hasEvaluationStarted ? styles.black : ''}>Evaluation has started</p>
                <p className={this.state.isComplete ? styles.black : ''}>Approval</p>
              </div>
            </div>
            { applicationSubmittedTooltip }
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

