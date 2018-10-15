import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import {Col, Container, Row, setConfiguration} from 'react-grid-system';
import ReactSVG from 'react-svg';
import produce from 'immer';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import {applications} from "../../../../api";
import jobIcon from '../../../../assets/ui/jobs.svg';

setConfiguration({ gutterWidth: 15 });

class Applications extends Component {
  state = {
    hasLoaded: false,

    applicant: {
      applications: []
    },
    evaluator: {
      currentApplications: [],
      pastApplications: []
    }
  };

  componentDidMount = () => {
    //switch between who is looking for applications
    switch(this.props.role) {
      //applicant
      case 2:
        this.applicantFetch();
        break;

      //byClusterEvaluator
      case 3:
        this.evaluatorFetch();
        break;
    }
  };

  onClickApplication = token => {
    this.props.history.push(`/applications/${token}`);
  };

  onClickJob = (jobId, jobOpportunityId) => {
    this.props.history.push(`/applications/applicants/${jobId}/${jobOpportunityId}`);
  };

  applicantFetch = () => {
    axios.get(applications.overview + this.props.employeeId)
      .then(res => {
        console.log(res.data.data);

        this.setState(produce(draft => {
          draft.applicant.applications = res.data.data
        }))
      })
  };

  evaluatorFetch = () => {
    axios.get(applications.evaluators + this.props.employeeId)
      .then(res => {
        if(res.data.status === 200) {
          this.setState(produce(draft => {
            draft.evaluator.currentApplications = res.data.data.current;
            draft.evaluator.pastApplications = res.data.data.past;

            draft.hasLoaded = true;
          }))
        } else {
          this.setState({hasLoaded: true})
        }
      })
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

    const byClusterEvaluatorApplications = () => {
      const current = this.state.evaluator.currentApplications.map(app => {

        return (
          <Col key={app.jobid} xs={2} style={{marginTop: 15}}>
            <div
              onClick={() => this.onClickJob(app.jobid, app.jobopportunityid)}
              className={styles.application}>
              <div className={styles.iconContainer}>
                <div className={styles.labelContainer}>
                  <p className={`${styles.label} ${styles.green}`}>{ app.numberofapplicants } APPLICANTS</p>
                  {
                    parseInt(app.isstarted, 10) === 1 ?
                      <p className={`${styles.label} ${styles.blue}`}>STARTED</p> :
                      null
                  }
                </div>
                <ReactSVG path={jobIcon} svgStyle={{fill: '#4688FF', height: 60}}/>
              </div>
              <div className={styles.bottom}>
                <p>Applications for {app.jobtitle}</p>
              </div>
            </div>
          </Col>
        )
      });

      const past = this.state.evaluator.pastApplications.map(app => {
        return (
          <Col key={app.jobid} xs={2} style={{marginTop: 15}}>
            <div
              onClick={() => this.onClickJob(app.jobid, app.jobopportunityid)}
              className={styles.application}>
              <div className={styles.iconContainer}>
                <div className={styles.labelContainer}>
                  <p className={`${styles.label} ${styles.green}`}>{ app.numberofapplicants } APPLICANTS</p>
                  {
                    parseInt(app.isstarted, 10) === 1 ?
                      <p className={`${styles.label} ${styles.blue}`}>STARTED</p> :
                      null
                  }
                </div>
                <ReactSVG path={jobIcon} svgStyle={{fill: '#4688FF', height: 60}}/>
              </div>
              <div className={styles.bottom}>
                <p>Applications for {app.jobtitle}</p>
              </div>
            </div>
          </Col>
        )
      });

      return (
        <Fragment>
          <p className={univStyles.groupLabel}>CURRENT APPLICATIONS</p>
          <div style={{marginTop: 15}}>
            {
              this.state.evaluator.currentApplications.length > 0 ?
                <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                  <Row>
                    { current }
                  </Row>
                </Container> :
                <p style={{margin: 0, textAlign: 'center', fontSize: 14}}>There are no current applications yet.</p>
            }
          </div>
          <p className={univStyles.groupLabel}>PAST APPLICATIONS</p>
          <div style={{marginTop: 15}}>
            {
              this.state.evaluator.pastApplications.length > 0 ?
                <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                  <Row>
                { past }
                  </Row>
                </Container> :
                <p style={{margin: 0, textAlign: 'center', fontSize: 14}}>There are no past applications yet.</p>
            }
          </div>
        </Fragment>
      )
    };

    const applicantApplications = () => {
      return this.state.applicant.applications.map(app => {
        return (
          <Col key={app.token} xs={2} style={{marginTop: 15}}>
            <div
              onClick={() => this.props.history.push(`/applications/${app.token}`)}
              className={styles.application}>
              <div className={styles.iconContainer}>
                <div className={styles.labelContainer}>
                </div>
                <ReactSVG path={jobIcon} svgStyle={{fill: '#4688FF', height: 60}}/>
              </div>
              <div className={styles.bottom}>
                <p>Applications for {app.jobtitle}</p>
              </div>
            </div>
          </Col>
        )
      });
    };

    //switcher component to switch between roles
    const switcher = () => {
      switch(this.props.role) {
        case 2:
          return applicantApplications();
        case 3:
          return byClusterEvaluatorApplications()
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
                  {/*{*/}
                    {/*this.state.applicantApplications.length > 0 || this.state.evaluatorJobs.length > 0 ?*/}
                      {/*<Container fluid style={{padding: 0, marginTop: '-15px'}}>*/}
                        {/*<Row>*/}
                          {/*{ switcher() }*/}
                        {/*</Row>*/}
                      {/*</Container> :*/}
                      {/*<div className={styles.noApplicationContainer}>*/}
                        {/*<p>You don't have any applications yet.</p>*/}
                      {/*</div>*/}
                  {/*}*/}
                  { switcher() }
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

