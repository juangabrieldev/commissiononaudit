import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import produce from 'immer';
import {Container, Row, Col, setConfiguration} from "react-grid-system";
import _ from 'lodash';
import moment from "moment";
import html2canvas from 'html2canvas';
import jsPdf from 'jspdf';

import { applications, evaluations, documents } from "../../../../api";

import univStyles from "../../styles.scss";
import Button from "../../../button/button";
import styles from "./styles.scss";
import Portal from "../../../portal/portal";
import check from "../../../../assets/ui/check.svg";
import Select from '../../../select/select';

setConfiguration({ gutterWidth: 15 });

class Applicants extends Component {
  state = {
    employees: [{
      jobtitle: ''
    }],
    evaluationData: [{
      details: {
        files: {}
      }
    }],
    hasStartedEvaluation: false,
    evaluationIsDone: false,
    currentNumberOfApplicant: 1,
    showModal: false,
    currentNumberOfDoc: 0,
    documentUrl: null,
    approved: [{}],
    rejected: [{}],
    rankingList: [{
      details: {
        ratings: {
          average: "0"
        }
      }
    }]
  };

  componentDidMount = () => {
    axios.get(applications.applicants + `${this.props.employeeId}/${this.props.match.params.jobId}/${this.props.match.params.jobOpportunityId}`)
    .then(res => {
      this.setState(produce(draft => {
        draft.employees = res.data.data.data;
        draft.hasStartedEvaluation = res.data.data.hasStartedEvaluation;
        draft.evaluationIsDone = res.data.data.evaluationIsDone;
      }), () => {
        if(this.state.hasStartedEvaluation || this.state.evaluationIsDone) {
          this.fetchEvaluation(this.props.match.params.jobId, this.props.match.params.jobOpportunityId)
        }
      })
    });

    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleClickOutside = e => {
    if (this.refs.preview && !this.refs.preview.contains(e.target)) {
      document.body.style.overflow = "visible";

      this.setState({
        showModal: false,
        documentUrl: null
      })
    }
  };

  startEvaluation = () => {
    axios.post(evaluations.create, {
      jobOpportunityId: this.props.match.params.jobOpportunityId,
      jobId: this.props.match.params.jobId,
    })
      .then(() => {
        this.fetchEvaluation(this.props.match.params.jobId, this.props.match.params.jobOpportunityId)
      })
  };

  fetchEvaluation = (jobId, jobOpportunityId) => {
    axios.get(evaluations.get + `${jobId}/${jobOpportunityId}`)
      .then(res => {
        this.setState(produce(draft => {
          draft.hasStartedEvaluation = res.data.hasStarted;
          draft.evaluationIsDone = res.data.isDone;
          draft.evaluationData = res.data.data;
          draft.approved = res.data.contenders;
          draft.rankingList = res.data.rankingList;
          draft.rejected = res.data.rejected;
        }))
      })
  };

  onDocumentClick = (url) => {
    axios.get(documents.get + url.replace('https://anonfile.com/', ''))
      .then(res => {
        document.body.style.overflow = "hidden";

        this.setState({
          showModal: this.state.showModal ? null : true,
          documentUrl: res.data.remoteUrl
        })
      })
    // this.setState({
    //   showModal: this.state.showModal ? null : true
    // })
  };

  saveEvaluation = () => {
    axios.post(evaluations.update, {
      jobId: this.props.match.params.jobId,
      jobOpportunityId: this.props.match.params.jobOpportunityId,
      approved: this.state.approved,
      rejected: this.state.rejected
    })
      .then(() => {
        this.fetchEvaluation(this.props.match.params.jobId, this.props.match.params.jobOpportunityId)
      })
  };

  onReject = () => {
    this.setState(produce(draft => {
      draft.rejected.push(this.state.evaluationData[this.state.currentNumberOfApplicant - 1]);
    }), () => {
      window.scrollTo(0, 0);

      if(this.state.currentNumberOfApplicant < this.state.evaluationData.length) {
        this.setState(produce(draft => {
          draft.currentNumberOfApplicant++
        }))
      } else {
        this.saveEvaluation();
      }
    })
  };

  onAccept = () => {
    this.setState(produce(draft => {
      draft.approved.push(this.state.evaluationData[this.state.currentNumberOfApplicant - 1]);
    }), () => {
      window.scrollTo(0, 0);

      if(this.state.currentNumberOfApplicant < this.state.evaluationData.length) {
        this.setState(produce(draft => {
          draft.currentNumberOfApplicant++
        }))
      } else {
        this.saveEvaluation();
      }
    })
  };

  openContext = () => {
    this.openContextBool = true;
    this.forceUpdate();
  };

  generate = switcher => {
    let input;

    console.log(switcher);

    switch(switcher) {
      case 1: input = document.getElementById('listOfApplicantsReport');
        break;
      case 2: input = document.getElementById('listOfQualifiedAndNotQualifiedReport');
        break;
      case 3: input = document.getElementById('rankingListReport');
    }

    html2canvas(input, { scale: 2.115 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPdf();

        pdf.internal.scaleFactor = 6;

        pdf.addImage(imgData, 'JPEG', 0, 0);

        this.openContextBool = false;
        this.forceUpdate();

        pdf.save("download.pdf");
      });
  };

  render() {
    const jobsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Application for { this.state.employees[0].jobtitle }</p>
        <div onClick={this.openContext} className={styles.generate}>
          <div />
          <div />
          <div />

          {
            this.openContextBool ?
              <div className={styles.context}>
                <p onClick={() => this.generate(1)}>Generate list of applicants</p>
                <p onClick={() => this.generate(2)}>Generate list of qualified and not qualified applicants</p>
                <p onClick={() => this.generate(3)}>Generate ranking list</p>
              </div> :
              null
          }
        </div>
      </div>;

    const applications = this.state.employees.map((employee, i) => {
      return (
        <div key={i}>
          <p>{employee.firstname} {employee.middleinitial != null ? employee.middleinitial + '.' : ''} {employee.lastname}</p>
        </div>
      )
    });

    const bottomBar =
      <div
        className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <p style={{fontSize: 16}}>Applicant {this.state.currentNumberOfApplicant} of {this.state.evaluationData.length}</p>
        <div style={{marginLeft: 'auto', marginRight: 15}}>
          <Button onClick={this.onReject} width={70} classNames={['cancel']} name="REJECT"/>
          <Button style={{marginLeft: 15}} onClick={this.onAccept} width={70} classNames={['primary']} name="ACCEPT"/>
        </div>
      </div>;

    let documentsContainer = [];

    if(this.state.hasStartedEvaluation && this.state.evaluationData != null) {
      const files = this.state.evaluationData[this.state.currentNumberOfApplicant - 1].details.files;

      Object.keys(files).forEach((key, i) => {
        const containerName = _.upperFirst(_.lowerCase(key));

        const con = (
          <Col key={key} xs={2} style={{marginTop: 15}}>
            <div
              onClick={() => this.onDocumentClick(files[key].remoteFilePath)}
              className={styles.uploadContainer}>
              <div className={styles.iconContainer}>
                <div className={styles.validity}>
                  <img src={check} height={16} alt=""/>
                </div>
              </div>
              <div className={styles.bottom}>
                <p>{ containerName }</p>
              </div>
            </div>
          </Col>
        );

        documentsContainer.push(con);
      });
    }

    const evaluationWindow = this.state.evaluationData.map((evaluation, i) => {
      if(i === this.state.currentNumberOfApplicant - 1) {
        return (
          <Fragment key={i}>
            { bottomBar }
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form} style={{marginBottom: 200}}>
                  <div className={univStyles.header}>
                    <p>
                      Applicant:
                      {
                        ' ' + evaluation.firstname +
                        ( evaluation.middleinitial != null ? ' ' + evaluation.middleinitial + '.' : '' ) +
                        ' ' + evaluation.lastname
                      }
                    </p>
                  </div>
                  <div className={univStyles.formBody} style={{padding: 15}}>
                    <div className={styles.evaluationContainer}>
                      <p className={styles.annotation}>PDS - JOB REQUIREMENTS COMPARISON</p>
                      <div className={styles.pdsJob}>
                        <div>
                          <div>
                            <p className={styles.annotation}>Education</p>
                            <p>Bachelor of Science in Accountancy</p>
                          </div>
                          <div className={styles.hr}/>
                          <div>
                            <p className={styles.annotation}>Relative experience</p>
                          </div>
                        </div>
                        <div/>
                      </div>
                      <p className={styles.annotation}>DOCUMENTS</p>
                      <Container fluid style={{padding: 0, marginTop: '-7px'}}>
                        <Row>
                          { documentsContainer }
                        </Row>
                      </Container>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )
      } else return null
    });

    const documentsModal = (
      <div className={styles.modal}>
        <div>
          PREVIOUS
        </div>
        <div className={styles.preview} ref="preview">
          {
            this.state.documentUrl != null ?
              <iframe
                src={'https://view.officeapps.live.com/op/embed.aspx?src=' + this.state.documentUrl}
                width='100%' height='100%' style={{boxSizing: 'border-box'}} frameBorder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft
                Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
              </iframe> :
              null
          }
        </div>
        <div>
          NEXT
        </div>
      </div>
    );

    const listOfApplicantsReportRow = this.state.approved.map(emp => {
      return (
        <tr>
          <td>{ emp.employeeid }</td>
          <td>
            {
              ' ' + emp.firstname +
              ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
              ' ' + emp.lastname
            }
          </td>
          <td>Accountant II</td>
          <td>Administration Sector</td>
          <td>{ moment(emp.dateofsubmission).format('dddd, MMMM D YYYY') }</td>
        </tr>
      )
    });

    const listOfApplicantsReport = (
      <div id="listOfApplicantsReport"  style={{
        backgroundColor: '#fff',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        boxSizing: 'border-box'
      }}>
        <p style={{fontSize: 25, fontWeight: 600, textAlign: 'center'}}>LIST OF APPLICANTS APPLYING FOR { this.state.employees[0].jobtitle.toUpperCase() }</p>
        <p>Total number of applicants: { this.state.employees.length }</p>
        <table className={styles.demo}>
          <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Current position</th>
            <th>Current office</th>
            <th>Date of submission</th>
          </tr>
          </thead>
          <tbody>
          { listOfApplicantsReportRow }
          </tbody>
        </table>
      </div>
    );

    const listOfQualifiedAndNotQualifiedReportRow1 = this.state.approved.map(emp => {
      return (
        <tr>
          <td>{ emp.applicantid }</td>
          <td>
            {
              ' ' + emp.firstname +
              ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
              ' ' + emp.lastname
            }
          </td>
          <td>Accountant II</td>
          <td>Administration Sector</td>
          <td>{ moment(emp.dateofsubmission).format('dddd, MMMM D YYYY') }</td>
          <td>Approved</td>
        </tr>
      )
    });

    const listOfQualifiedAndNotQualifiedReportRow2 = this.state.rejected.map(emp => {
      return (
        <tr>
          <td>{ emp.applicantid }</td>
          <td>
            {
              ' ' + emp.firstname +
              ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
              ' ' + emp.lastname
            }
          </td>
          <td>Accountant II</td>
          <td>Administration Sector</td>
          <td>{ moment(emp.dateofsubmission).format('dddd, MMMM D YYYY') }</td>
          <td>Rejected</td>
        </tr>
      )
    });

    const listOfQualifiedAndNotQualifiedReport = (
      <div id="listOfQualifiedAndNotQualifiedReport"  style={{
        backgroundColor: '#fff',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        boxSizing: 'border-box'
      }}>
        <p style={{fontSize: 25, fontWeight: 600, textAlign: 'center'}}>LIST OF QUALIFIED / NOT QUALIFIED APPLICANTS APPLYING FOR { this.state.employees[0].jobtitle.toUpperCase() }</p>
        <p>Total number of applicants: { this.state.employees.length }</p>
        <p>Total number of qualified applicants: { this.state.approved.length }</p>
        <p>Total number of not qualified applicants: { this.state.rejected.length }</p>
        <table className={styles.demo}>
          <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Current position</th>
            <th>Current office</th>
            <th>Date of submission</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          { listOfQualifiedAndNotQualifiedReportRow1 }
          { listOfQualifiedAndNotQualifiedReportRow2 }
          </tbody>
        </table>
      </div>
    );

    console.log(this.state.rankingList);

    const rankingListReportRow = this.state.rankingList.map((emp, i) => {
      return (
        <tr>
          <td>{ emp.applicantid }</td>
          <td>
            {
              ' ' + emp.firstname +
              ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
              ' ' + emp.lastname
            }
          </td>
          <td>{ parseFloat(emp.details.ratings.average).toFixed(2) }</td>
          <td># {i + 1}</td>
        </tr>
      )
    });

    const rankingListReport = (
      <div id="rankingListReport"  style={{
        backgroundColor: '#fff',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        boxSizing: 'border-box'
      }}>
        <p style={{fontSize: 25, fontWeight: 600, textAlign: 'center'}}>RANKING LIST FOR { this.state.employees[0].jobtitle.toUpperCase() }</p>
        <table className={styles.demo}>
          <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Rank</th>
          </tr>
          </thead>
          <tbody>
          { rankingListReportRow }
          </tbody>
        </table>
      </div>
    );

    return (
      <Fragment>
        {
          this.state.showModal ?
            <Portal>
              { documentsModal }
            </Portal> :
            null
        }
        { jobsTitleBar }
        <div style={{position: 'fixed', top: -4000}}>
          { listOfApplicantsReport }
          { listOfQualifiedAndNotQualifiedReport }
          { rankingListReport }
        </div>
        {
          this.state.hasStartedEvaluation && !this.state.evaluationIsDone ?
            evaluationWindow :
            <div className={univStyles.main}>
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>List of applicants</p>
                    <div className={styles.startEvaluationContainer}>
                      {
                        !this.state.evaluationIsDone ?
                          <Button
                            onClick={this.startEvaluation}
                            classNames={['primary']}
                            name="START EVALUATION" /> :
                          null
                      }
                      <div>

                      </div>
                    </div>
                  </div>
                  <div className={univStyles.formBody} style={{padding: 15}}>
                    <div className={styles.applicantsContainer}>
                      { applications }
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
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

export default withRouter(connect(mapStateToProps)(Applicants));

