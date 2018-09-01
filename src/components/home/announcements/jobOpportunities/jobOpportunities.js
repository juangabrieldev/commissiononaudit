import React, {Component, Fragment} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import moment from 'moment';

import univStyles from '../../styles.scss'
import Button from "../../../button/button";
import Input from "../../../input/input";
import Select from "../../../select/select";
import DatePicker from '../../../datePicker/datePicker';
import Numeric from '../../../numeric/numeric';

import {jobOpportunities} from "../../../../api";

class JobOpportunities extends Component {
  state = {
    jobs: [],
    previousLink: null,
    title: '',
    selectedJob: [],
    jobOpportunities: [],
    deadline: null,
    vacancies: [],
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
  };


  fetch = () => {
    axios.get(jobOpportunities.select + this.props.employeeId)
      .then(res => {
        this.setState({jobs: res.data.data});
      })
  };

  onChangeTitleHandler = e => {
    this.setState({title: e.target.value})
  };

  onChangeJobHandler = o => {
    this.setState({selectedJob: o}, () => {
      this.vacancies = o;
    })
  };

  onChangeDeadline = deadline => {
    this.setState({deadline})
  };

  onChangeVacanciesHandler = (vacancies, value) => {
    this.vacancies = this.vacancies.map(vacant => {
      if (vacant.value === value) {
        vacant.vacancy = vacancies;
      }

      return vacant
    });
  };

  onSave = () => {
    axios.post(jobOpportunities.create, {
      employeeId: this.props.employeeId,
      deadline: moment(this.state.deadline).format(),
      content: {
        title: this.state.title,
        jobs: this.vacancies
      }
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
              <Button onClick={this.onCreate} classNames={['primary']} name="+  POST NEW JOB OPPORTUNITY"/>
            </React.Fragment>
        }
      </div>;

    const vacancies = this.state.selectedJob.map(job => {
      return (
        <div className={univStyles.input}>
          <Numeric onChangeHandler={v => this.onChangeVacanciesHandler(v, job.value)} width={200} name={`* Vacancies for ${job.label}`}/>
        </div>
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
                  <div className={univStyles.formBody}>

                  </div>
                </div>
              </div>
            </div>
          }/>
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
                        {
                          vacancies
                        }
                        <div className={univStyles.input}>
                          <DatePicker
                            selected={this.state.deadline}
                            onChange={o => this.onChangeDeadline(o)}
                            placeholder="* Deadline" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
            </div>
          }/>
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
