import React, {Component, Fragment} from 'react';
import {Link, Route, Switch, withRouter} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import moment from 'moment';
import produce from 'immer';
import { Container, Row, Col, setConfiguration } from 'react-grid-system';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import Button from "../../../button/button";
import Input from "../../../input/input";
import Select from "../../../select/select";
import DatePicker from '../../../datePicker/datePicker';
import Numeric from '../../../numeric/numeric';

import {jobOpportunities} from "../../../../api";
import TextArea from "../../../textarea/textArea";

setConfiguration({ gutterWidth: 15 });

class JobOpportunities extends Component {
  state = {
    jobs: [],
    previousLink: null,
    title: '',
    selectedJob: [],
    jobOpportunities: [],
    deadline: null,
    vacancies: [],
    description: ''
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/announcements/job-opportunities/new')
  };

  onCancel = () => {
    this.props.history.push(this.state.previousLink);
  };

  componentDidMount = () => {
    this.fetch();
    this.setState({previousLink: '/announcements/job-opportunities/'})
  };


  fetch = () => {
    axios.get(jobOpportunities.select + this.props.employeeId)
      .then(res => {
        this.setState({jobs: res.data.data});
        return axios.get(jobOpportunities.root + this.props.employeeId)
      })
      .then(res => this.setState({jobOpportunities: res.data.data}))
  };

  onChangeTitleHandler = e => {
    this.setState({title: e.target.value})
  };

  onChangeJobHandler = o => {
    o.forEach(obj => {
      if(!(!!obj.vacancies)) {
        obj.vacancies = 0
      }
    });

    this.setState({selectedJob: o})
  };

  onChangeDeadline = deadline => {
    this.setState({deadline})
  };

  onChangeVacanciesHandler = (vacancies, index) => {
    this.setState(produce(draft => {
      draft.selectedJob[index].vacancies = vacancies
    }))
  };

  onChangeDescription = e => {
    const value = e.target.value;

    this.setState({description: value})
  };

  onSave = () => {
    axios.post(jobOpportunities.create, {
      employeeId: this.props.employeeId,
      deadline: moment(this.state.deadline).format(),
      content: {
        title: this.state.title,
        jobs: this.state.selectedJob
      },
      description: this.state.description
    })
      .then(res => {

      })
  };

  render() {
    const jobOpportunitiesTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + (this.props.location.pathname.includes('/new') ? ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Post new job opportunity</p>
              <a onClick={this.onCancel}>Cancel</a>
              <Button disabled={this.state.saveDisabled} onClick={this.onSave} width={70} classNames={['tertiary']} name="SAVE"/>
            </React.Fragment> :
            <React.Fragment>
              <p>Job Opportunities</p>
              {
                this.props.role === 1 ?
                  <Button onClick={this.onCreate} classNames={['primary']} name="+  POST NEW JOB OPPORTUNITY"/> :
                  null
              }
            </React.Fragment>
        }
      </div>;

    const vacancies = this.state.selectedJob.map((job, i) => {
      return (
        <div className={univStyles.input}>
          <Numeric
            value={this.state.selectedJob[i].vacancies}
            bindValue
            onChangeHandler={v => this.onChangeVacanciesHandler(v, i)}
            width={200}
            name={`* Vacancies for ${job.label}`}/>
        </div>
      )
    });

    const JobOpportunitiesRow = this.state.jobOpportunities.map(job => {
      return (
        <Link to={'/announcements/job-opportunities/' + job.id}>
          <div>
            <p>{job.content.title}</p>
          </div>
        </Link>
      )
    });

    return (
      <Fragment>
        {jobOpportunitiesTitleBar}
        <Switch>
          <Route path={'/announcements/job-opportunities'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Job Opportunities</p>
                    <p className={univStyles.subtitle}>{this.state.jobOpportunities.length} records</p>
                  </div>
                  <div className={univStyles.formBody} style={{padding: 15}}>
                    <div className={styles.jobOpportunities}>
                      {JobOpportunitiesRow}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }/>
          {
            this.props.role === 1 ?
              <Route path={'/announcements/job-opportunities/new'} exact render={() =>
                <div className={univStyles.main}>
                  <div className={univStyles.pageMainNew}>
                    <div className={univStyles.form}>
                      <div className={univStyles.header}>
                        <p>Job Opportunity Details</p>
                      </div>
                      <div className={univStyles.formBody}>
                        <div style={{padding: 15}}>
                          <div className={univStyles.groupOfFields}>
                            <p className={univStyles.title}>Primary details</p>
                            <div className={univStyles.input}>
                              <Input value={this.state.title} characterLimit={50} onChangeHandler={e => this.onChangeTitleHandler(e)} name="* Title"/>
                            </div>
                            <div className={univStyles.input}>
                              <Select
                                isMulti
                                isClearable
                                value={this.state.selectedJob}
                                onChangeHandler={this.onChangeJobHandler}
                                options={this.state.jobs}
                                placeholder="* Job(s)"/>
                            </div>
                            { vacancies }
                            <div className={univStyles.input}>
                              <DatePicker
                                selected={this.state.deadline}
                                onChange={o => this.onChangeDeadline(o)}
                                placeholder="* Deadline" />
                            </div>
                            <div className={univStyles.input}>
                          <TextArea
                            value={this.state.description}
                            characterLimit={300}
                            onChangeHandler={this.onChangeDescription}
                            name="* Description" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
                </div>
              }/> :
              null
          }
        </Switch>
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

export default withRouter(connect(mapStateToProps)(JobOpportunities));
