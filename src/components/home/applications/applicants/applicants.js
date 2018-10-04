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
    currentNumberOfApplicant: 1,
    showModal: false,
    currentNumberOfDoc: 0,
    documentUrl: null,
    approved: [],
    rejected: []
  };

  componentDidMount = () => {
    axios.get(applications.applicants + `${this.props.employeeId}/${this.props.match.params.jobId}/${this.props.match.params.jobOpportunityId}`)
    .then(res => {
      this.setState(produce(draft => {
        draft.employees = res.data.data.data;
        draft.hasStartedEvaluation = res.data.data.hasStartedEvaluation
      }), () => {
        if(this.state.hasStartedEvaluation) {
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
      this.setState({
        showModal: false,
        documentUrl: null
      })
    }
  };

  print = () => {
    console.log('hehe');

    const input = document.getElementById('report');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPdf();
        pdf.scaleFactor = 5;

        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      })
    ;
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
          draft.hasStartedEvaluation = true;
          draft.evaluationData = res.data.data;
        }))
      })
  };

  onDocumentClick = (url) => {
    axios.get(documents.get + url.replace('https://anonfile.com/', ''))
      .then(res => {
        this.setState({
          showModal: this.state.showModal ? null : true,
          documentUrl: res.data.remoteUrl
        })
      })
    // this.setState({
    //   showModal: this.state.showModal ? null : true
    // })
  };

  onReject = () => {
    console.log()
  };

  onAccept = () => {
    console.log(this.state.employees)
  };

  render() {
    const jobsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Application for { this.state.employees[0].jobtitle }</p>
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
                        <div/>
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

    const reportsRow = this.state.employees.map(emp => {
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

    const reports = (
      <div id="report"  style={{
        backgroundColor: '#fff',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10,
        boxSizing: 'border-box'
      }}>
        <p style={{fontSize: 25, fontWeight: 600, textAlign: 'center'}}>LIST OF APPLICANTS APPLYING FOR { this.state.employees[0].jobtitle.toUpperCase() }</p>
        <p style={{marginLeft: 52}}>Total number of applicants: { this.state.employees.length }</p>
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
          { reportsRow }
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
          { reports }
        </div>
        {
          this.state.hasStartedEvaluation ?
            evaluationWindow :
            <div className={univStyles.main}>
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>List of applicants</p>
                    <div className={styles.startEvaluationContainer}>
                      <Button
                        style={{marginRight: 12}}
                        onClick={this.print}
                        classNames={['cancel']}
                        name="GENERATE REPORT"
                      />
                      <Button
                        onClick={this.startEvaluation}
                        classNames={['primary']}
                        name="START EVALUATION" />
                      <div>

                      </div>
                    </div>
                  </div>
                  <div className={univStyles.formBody} style={{padding: 15}}>
                    <div className={styles.applicantsContainer}>
                      {applications}
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

