import React, { Component, Fragment } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import ReactTooltip from 'react-tooltip';

import NotFoundEnabler from '../../../notFound/notFoundEnabler';
import Portal from '../../../portal/portal';
import ViewOpportunityModal from './viewOpportunityModal';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import { employees, jobOpportunities, jobs } from "../../../../api";
import connect from "react-redux/es/connect/connect";

class viewOpportunity extends Component {
  state = {
    jobOpportunity: {},
    data: {},
    isValid: false,
    hasLoaded: false,
    showModal: false
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

  onClickOpenJob = v => {
    let data = {
      jobInformation: null,
      employeeData: null
    };

    axios.get(jobs.view + v)
      .then(res => {
        data.jobInformation = res.data.data;

        return axios.get(employees.personalDataSheet + this.props.employeeId)
      })
      .then(res => {
        data.employeeData = res.data.data;

        this.setState({data, showModal: true})
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
              <p className={styles.openJobs}>- {job.label}</p>
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
        {
          this.state.showModal ?
            <Portal>
              <ViewOpportunityModal
                data={this.state.data}
                hideModal={() => this.setState({showModal: false})} />
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

export default connect(mapStateToProps)(viewOpportunity);
