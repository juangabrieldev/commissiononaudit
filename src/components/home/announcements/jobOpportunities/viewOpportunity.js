import React, { Component, Fragment } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import moment from 'moment';
import ReactSVG from "react-svg";
import { withRouter } from 'react-router-dom';
import stringQuery from 'stringquery';

import NotFoundEnabler from '../../../notFound/notFoundEnabler';
import Portal from '../../../portal/portal';
import ViewOpportunityModal from './viewOpportunityModal';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import { employees, jobOpportunities, jobs } from "../../../../api";
import connect from "react-redux/es/connect/connect";

import building from '../../../../assets/ui/building.svg';
import calendar from '../../../../assets/ui/calendar.svg';

import user from '../../../../assets/ui/user.svg';
import vacancy from '../../../../assets/ui/openBox.svg';

class viewOpportunity extends Component {
  state = {
    jobOpportunity: {},
    data: {},
    isValid: false,
    hasLoaded: false,
    showModal: false,
    officeId: null,
  };

  fetch = () => {
    axios.get(jobOpportunities.view + this.props.match.params.id)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            jobOpportunity: res.data.data[0],
            hasLoaded: true,
          })
        }

        const { jobid } =  stringQuery(this.props.location.search);

        if(jobid) {
          this.refs[jobid].click()
        }
      })
  };

  componentDidMount = () => {
    this.fetch();
  };

  onClickOpenJob = (jobId, evaluatorEmployeeId) => {
    let data = {
      jobInformation: null,
      employeeData: null,
      evaluatorEmployeeId,
      officeId: this.state.jobOpportunity.officeid
    };

    axios.get(jobs.view + jobId)
      .then(res => {
        data.jobInformation = res.data.data;

        return axios.get(employees.personalDataSheet + this.props.employeeId)
      })
      .then(res => {
        data.employeeData = res.data.data;

        //get the id of job opportunity and pass it to modal
        data.jobInformation.jobOpportunityId = parseInt(this.props.match.params.id, 10);

        this.setState({data, showModal: true})
      })
  };

  render() {
    let description, jobs, currentNumberOfApplicants, totalVacancies = 0;

    if(this.state.hasLoaded) {
      description = parse(this.state.jobOpportunity.description);

      jobs = this.state.jobOpportunity.content.jobs.map((job, i) => {
        return (
          <div className={styles.openJobs} key={i}>
            <p>{job.label}</p>
            <div className={styles.viewJob} ref={job.value} onClick={() => this.onClickOpenJob(job.value, job.evaluator.value)}>
              <p>VIEW</p>
            </div>
          </div>
        )
      });

      this.state.jobOpportunity.content.jobs.forEach(job => {
        totalVacancies += job.vacancies
      })
    }

    return (
      <Fragment>
        {
          this.state.hasLoaded ?
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p className={univStyles.goBack}>Go back</p>
              </div>
              <div className={univStyles.formBody} style={{padding: 15}}>
                <div className={styles.firstRow}>
                  <div className={univStyles.groupOfFields}>
                    <p className={univStyles.title}>PRIMARY DETAILS</p>
                    <div className={styles.viewOpportunity}>
                      <p className={styles.title}>
                        {this.state.jobOpportunity.content.title}
                      </p>
                      <div className={styles.details}>
                        <img src={building} alt="" height={14}/>
                        <p>&nbsp;&nbsp;{this.state.jobOpportunity.officename}</p>
                        <img src={calendar} alt="" style={{marginLeft: 20}} height={14}/>
                        <p>&nbsp;&nbsp;{moment(this.state.jobOpportunity.datecreated).format('MMMM DD, YYYY') +
                          ' at ' +
                          moment(this.state.jobOpportunity.datecreated).format('h:mm A')}
                        </p>
                      </div>
                      <p className={styles.description}>
                        {description}
                      </p>
                    </div>
                  </div>
                  <div className={univStyles.groupOfFields}>
                    <p className={univStyles.title}>ADDITIONAL INFORMATION</p>
                    <div style={{width: 300}}>
                      <div className={styles.comparison}>
                        <div className={styles.block}>
                          <div>
                            <p className={styles.blockNumber}>{totalVacancies}</p>
                            <ReactSVG
                              path={vacancy}
                              svgStyle={{
                                fill: '#4688FF',
                                height: 15,
                              }}/>
                          </div>
                          <p style={{opacity: .8}}>TOTAL NUMBER OF VACANCIES</p>
                        </div>
                        <div className={styles.divider}/>
                        <div className={styles.block}>
                          <div>
                            <p className={styles.blockNumber}>0</p>
                            <ReactSVG
                              path={user}
                              svgStyle={{
                                fill: '#4688FF',
                                height: 20,
                              }}/>
                          </div>
                          <p style={{opacity: .8}}>CURRENT NUMBER OF APPLICANTS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.secondRow}>
                  <div className={univStyles.groupOfFields} style={{width: 400}}>
                    <p className={univStyles.title}>OPEN JOBS</p>
                    <div className={styles.openJobsContainer}>
                      {jobs}
                    </div>
                  </div>
                </div>
              </div>
            </div> :
            null
        }
        {
          this.state.showModal ?
            <Portal>
              <ViewOpportunityModal
                data={this.state.data}
                hideModal={() => this.setState({showModal: false, data: null})} />
            </Portal> :
            null
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    employeeId: state.authentication.employeeId
  }
};

export default withRouter(connect(mapStateToProps)(viewOpportunity));
