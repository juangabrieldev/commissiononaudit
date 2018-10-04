import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import { Container, Row, Col, setConfiguration } from 'react-grid-system';
import ReactSVG from 'react-svg';
import produce from 'immer';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import { applications } from "../../../../api";

import files from '../../../../assets/ui/files.svg';
import jobIcon from '../../../../assets/ui/jobs.svg';

setConfiguration({ gutterWidth: 15 });

class Applications extends Component {
  state = {
    applicantApplications: [],
    hasLoaded: false,
    evaluatorJobs: []
  };

  componentDidMount = () => {
    let url;

    //switch between who is looking for applications
    switch(this.props.role) {
      //applicant
      case 2:
        url = applications.overview + this.props.employeeId;
        break;

      //byClusterEvaluator
      case 3:
        url = applications.evaluators + this.props.employeeId;
        break;

      case 4:
        url = '';
        break;
    }

    //get the overview of applications
    axios.get(url)
      .then(res => {
        if(res.data.status === 200) {
          this.setState(produce(draft => {
            //switch between who is looking for applications
            switch(this.props.role) {
              case 2:
                draft.applicantApplications = res.data.data;
                break;
              case 3:
                draft.evaluatorJobs = res.data.data;
                break;
            }
            draft.hasLoaded = true;
          }))
        } else {
          this.setState({hasLoaded: true})
        }
      })
  };

  onClickApplication = token => {
    this.props.history.push(`/applications/${token}`);
  };

  onClickJob = (jobId, jobOpportunityId) => {
    this.props.history.push(`/applications/applicants/${jobId}/${jobOpportunityId}`);
  };

  render() {
    const applicationsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>
          {
            this.props.role === 2 ?
              'My applications' :
              'Applications'
          }
        </p>
      </div>;

    const applicantApplications = this.state.applicantApplications.map(application => {
      return (
        <Col key={application.token} xs={2} style={{marginTop: 15}}>
          <div
            onClick={() => this.onClickApplication(application.token)}
            className={styles.application}>
            <div className={styles.iconContainer}>
              <ReactSVG path={files} svgStyle={{fill: '#4688FF', height: 80}} />
            </div>
            <div className={styles.bottom}>
              <p>Application for {application.jobtitle}</p>
            </div>
          </div>
        </Col>
      )
    });

    const byClusterEvaluatorApplications = this.state.evaluatorJobs.map(job => {
      return (
        <Col xs={2} style={{marginTop: 15}}>
          <div
            onClick={() => this.onClickJob(job.jobid, job.jobopportunityid)}
            className={styles.application}>
            <div className={styles.iconContainer}>
              <ReactSVG path={jobIcon} svgStyle={{fill: '#4688FF', height: 80}} />
            </div>
            <div className={styles.bottom}>
              <p>Applications for {job.jobtitle}</p>
            </div>
          </div>
        </Col>
      )
    });

    //switcher component to switch between roles
    const switcher = () => {
      switch(this.props.role) {
        case 2:
          return applicantApplications;
        case 3:
          return byClusterEvaluatorApplications
      }
    };

    return (
      <Fragment>
        {applicationsTitleBar}
          <div className={univStyles.main}>
            <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
            <div className={univStyles.pageMain}>
              <div className={univStyles.form}>
                <div className={univStyles.header}>
                  <p>
                    {
                      this.props.role === 2 ?
                        'My applications' :
                        'Applications received'
                    }
                  </p>
                </div>
                <div className={univStyles.formBody} style={{padding: 15, position: 'relative'}}>
                  {
                    this.state.applicantApplications.length > 0 || this.state.evaluatorJobs.length > 0 ?
                      <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                        <Row>
                          { switcher() }
                        </Row>
                      </Container> :
                      <div className={styles.noApplicationContainer}>
                        <p>You don't have any applications yet.</p>
                      </div>
                  }
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

export default withRouter(connect(mapStateToProps)(Applications));

