import React, { Component, Fragment } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import ReactTooltip from 'react-tooltip';

import NotFoundEnabler from '../../../notFound/notFoundEnabler';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import { jobOpportunities, jobs } from "../../../../api";
import connect from "react-redux/es/connect/connect";

class viewOpportunity extends Component {
  state = {
    jobOpportunity: {},
    jobInformation: {},
    isValid: false,
    hasLoaded: false
  };

  fetch = () => {
    axios.get(jobOpportunities.view + this.props.match.params.id + `?e=${this.props.employeeId}`)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            jobOpportunity: res.data.data[0],
            hasLoaded: true
          })
        }
      })
  };

  componentDidMount = () => {
    this.fetch()
  };

  onClickOpenJob = (v, i) => {
    console.log('hey');

    axios.get(jobs.view + v)
      .then(res => {
        this.setState({jobInformation: res.data.data})
      })
  };

  render() {
    let description, jobs;

    if(this.state.hasLoaded) {
      description = parse(this.state.jobOpportunity.description);

      jobs = this.state.jobOpportunity.content.jobs.map((job, i) => {
        return (
          <Fragment key={i}>
            <div onMouseDown={() => this.onClickOpenJob(job.value)}>
              <p className={styles.openJobs} data-event='click focus' data-tip data-for={job.value.toString()}>{job.label}</p>
              <ReactTooltip className={styles.tooltip} place="right" id={job.value.toString()} type='light' effect='solid'>
                <div className={styles.container}>
                  <div className={styles.comparison}>
                    <div>
                      <p>Position title: </p>
                      <p>{job.label}</p>
                    </div>
                  </div>
                </div>
              </ReactTooltip>
            </div>
          </Fragment>
        )
      });
    }
    return (
      <Fragment>
        {
          this.state.hasLoaded ?
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>{this.state.jobOpportunity.content.title}</p>
              </div>
              <div className={univStyles.formBody} style={{padding: 14, display: 'flex', flexDirection: 'column'}}>
                <div className={univStyles.fields} style={{alignSelf: 'start'}}>
                  <p className={univStyles.title}>DESCRIPTION</p>
                  <p>{description}</p>
                </div>
                <div className={univStyles.fields} style={{alignSelf: 'start'}}>
                  <p className={univStyles.title}>OPEN JOB{this.state.jobOpportunity.content.jobs.length > 1 ? 'S' : ''}</p>
                  { jobs }
                </div>
              </div>
            </div> :
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

export default connect(mapStateToProps)(viewOpportunity);
