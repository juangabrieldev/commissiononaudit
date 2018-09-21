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
import NotFound from '../../../notFound/notFound';

import ViewOpportunity from './viewOpportunity';

import { jobOpportunities } from "../../../../api";
import TextArea from "../../../textarea/textArea";
import CheckBox from "../../../checkBox/checkBox";

import { addToast } from "../../../../store/actions/ui/ui";

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
    description: '',
    isSingleDeadline: false,
    singleDeadline: null
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
    let jobs;

    axios.get(jobOpportunities.select + this.props.employeeId)
      .then(res => {
        jobs = res.data.data;

        return axios.get(jobOpportunities.root + this.props.employeeId)
      })
      .then(res => this.setState({jobOpportunities: res.data.data, jobs}))
  };

  reset = () => {
    this.setState({
      title: '',
      selectedJob: [],
      deadline: null,
      vacancies: [],
      description: '',
      isSingleDeadline: false,
      singleDeadline: null
    })
  };

  onChangeTitleHandler = e => {
    this.setState({title: e.target.value})
  };

  onChangeJobHandler = o => {
    o.forEach(obj => {
      if(!(!!obj.vacancies) && !(!!obj.deadline) && !(!!obj.isClosed)) {
        obj.vacancies = 0;
        obj.deadline = null;
        obj.isClosed = false
      }
    });

    if(o.length === 1) { //if there's only one job
      this.setState({selectedJob: o, isSingleDeadline: false})
    } else {
      this.setState({selectedJob: o})
    }
  };

  onChangeDeadline = (deadline, i) => {
    if(this.state.isSingleDeadline) {
      this.setState({singleDeadline: deadline })
    } else {
      this.setState(produce(draft => {
        draft.selectedJob[i].deadline = deadline;
      }))
    }
  };

  onChangeVacanciesHandler = (vacancies, index) => {
    this.setState(produce(draft => {
      draft.selectedJob[index].vacancies = vacancies
    }))
  };

  singleDeadlineCheckBoxHandler = v => {
    this.setState(produce(draft => {
      draft.isSingleDeadline = v;
    }));
  };

  onChangeDescription = e => {
    const value = e.target.value;

    // let text = 'Good day!<br><br>Requirements<br>- Must have at least<br>- Must have at least';
    //
    // text = text.replace(/<br ?\/?>/g, "\n");
    //
    // console.log(text);
    //
    // this.setState({description: text});

    this.setState({description: value})
  };



  onSave = () => {
    axios.post(jobOpportunities.create, {
      employeeId: this.props.employeeId,
      content: {
        title: this.state.title,
        jobs: this.state.selectedJob,
        isSingleDeadline: this.state.isSingleDeadline,
      },
      description: this.state.description
    })
      .then(res => {
        this.props.addToast(`Successfully added ${this.state.title} to job opportunities.`);
        this.fetch();
        this.props.history.push(this.state.previousLink);
        this.reset();
      })
  };

  render() {
    const jobOpportunitiesTitleBar =
      <div className={univStyles.titleBar +
      ' ' + univStyles.fullWidth +
      ' ' + (this.props.location.pathname.includes('/new') && this.props.role === 1 ?
      ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') && this.props.role === 1 ?
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

    // const vacancies = this.state.selectedJob.map((job, i) => {
    //   return (
    //     <div className={univStyles.input}>
    //
    //     </div>
    //   )
    // });

    const vacanciesDeadline = this.state.selectedJob.map((job, i) => {
      return (
        <div key={i} className={univStyles.input} style={{display: 'flex'}}>
          <Numeric
            style={{marginRight: 15}}
            value={this.state.selectedJob[i].vacancies}
            bindValue
            onChangeHandler={v => this.onChangeVacanciesHandler(v, i)}
            width={300}
            name={`* Vacancies for ${job.label}`}/>
          {
            !this.state.isSingleDeadline ?
              <DatePicker
                minDate={moment()}
                style={{width: 300}}
                selected={this.state.selectedJob[i].deadline}
                onChange={o => this.onChangeDeadline(o, i)}
                placeholder={`* Deadline for ${job.label}`} /> :
              <Fragment>
                {
                  i === 0 ?
                    <DatePicker
                      minDate={moment()}
                      style={{width: 300}}
                      selected={this.state.singleDeadline}
                      onChange={o => this.onChangeDeadline(o, i)}
                      placeholder={"* Deadline for all jobs"}/> :
                        null
                }
              </Fragment>
          }

        </div>
      )
    });

    const JobOpportunitiesRow = this.state.jobOpportunities.map(job => {
      return (
        <Link to={'/announcements/job-opportunities/' + job.id}>
          <div>
            <p className={styles.title}>{job.content.title}</p>
            <p className={styles.subtitle}>
              {job.content.jobs.length} job{job.content.jobs.length > 1 ? 's' : ''} open
            </p>
          </div>
        </Link>
      )
    });

    return (
      <Fragment>
        {jobOpportunitiesTitleBar}
        <Switch>
          <Route path="/announcements/job-opportunities" exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Job Opportunities</p>
                    <p className={univStyles.subtitle}>{this.state.jobOpportunities.length} records</p>
                  </div>
                  <div className={univStyles.formBody} style={{padding: 15}}>
                    <div className={univStyles.groupOfFields}>
                      <p className={univStyles.title}>On going</p>
                      <div className={styles.jobOpportunities}>
                        {JobOpportunitiesRow}
                      </div>
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
                    <div className={univStyles.form} style={{marginBottom: 50}}>
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
                              this.state.selectedJob.length > 1 ?
                                <div className={univStyles.input} style={{display: 'flex', alignItems: 'center'}}>
                                  <CheckBox toggle={this.singleDeadlineCheckBoxHandler} message="Single deadline for all selected jobs."/>
                                </div> :
                                null
                            }
                            { vacanciesDeadline }
                            <div className={univStyles.input}>
                          <TextArea
                            value={this.state.description}
                            characterLimit={1000}
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
          <Route path="/announcements/job-opportunities/:id" exact render={() => (
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <Route path="/announcements/job-opportunities/:id" exact component={ViewOpportunity}/>
              </div>
            </div>
          )} />
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

const mapDispatchToProps = dispatch => {
  return {
    addToast: message => dispatch(addToast(message))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JobOpportunities));
