import React, {Component} from 'react';
import {Switch, Route, Link, withRouter} from 'react-router-dom';
import { Container, Row, Col, setConfiguration } from 'react-grid-system';

import axios from 'axios';
import connect from "react-redux/es/connect/connect";

import styles from './jobs.scss';

import Button from '../../../button/button';
import Select from '../../../select/select';

import {jobs, office, qualificationStandards} from "../../../../api";
import univStyles from "../../styles.scss";
import SearchBar from "../../searchBar/searchBar";
import Input from "../../../input/input";
import Numeric from "../../../numeric/numeric";
import TextArea from "../../../textarea/textArea";

import { initializeSocket, events } from "../../../../socket";

import * as actions from "../../../../store/actions/ui/actions";

setConfiguration({ gutterWidth: 15 });

class Jobs extends Component {
  state = {
    jobs: [],
    previousLink: '/maintenance/applicants',
    jobName: '',
    yearsOfExperience: null,
    hoursOfTraining: null,
    jobDescription: null,
    education: [],
    eligibility: [],
    salaryGrade: null,
    selectedOffice: null,
    selectedEducation: [],
    selectedEligibility: [],
    saveDisabled: false,
    office: []
  };

  componentDidMount = () => {
    this.fetch();

    const socket = initializeSocket();

    socket.on(events.jobs, this.fetch)
  };

  componentDidUpdate = (prevProps, prevState) => {
    // if(prevState !== this.state) {
    //   this.blockNavigationChecker();
    // }
  };

  fetch = () => {
    axios.get(office.get + '?applicants=1') //for react-select
      .then(res => {
        this.setState({office: res.data.data})
      });

    axios.get(qualificationStandards.select) //for react-select
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            education: [
              {
                label: 'Specific course',
                options: res.data.data.specificCourses
              },
              {
                label: 'Custom qualifications',
                options: res.data.data.customQualifications
              }
            ],
            eligibility: res.data.data.eligibility
          })
        }
      });

    axios.get(jobs.view)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            jobs: res.data.data
          })
        }
      })
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/maintenance/applicants/new')
  };

  onCancel = () => {
    this.props.blockNavigation(false);
    setTimeout(() => {
      this.props.history.push(this.state.previousLink);
      this.setState({officeName: ''})
    }, 0);
  };

  onChangeDescription = e => {
    this.setState({jobDescription: e.target.value})
  };

  onChangeJobName = e => {
    const value = e.target.value;

    this.setState({jobName: value})
  };

  onChangeSalaryGrade = v => {
    this.setState({salaryGrade: v}, () => {
    })
  };

  onChangeYearsOfExperience = v => {
    this.setState({yearsOfExperience: v}, () => {
    })
  };

  onChangeHoursOfTraining = v => {
    this.setState({hoursOfTraining: v}, () => {
    })
  };

  blockNavigationChecker = () => {
    // if (!!this.state.jobName || !!this.state.jobDescription || !!this.state.selectedEducation || !!this.state.selectedEligibility) {
    //   if (!this.props.blockedNavigation) {
    //     this.props.blockNavigation(true, `You haven't finished your post yet. Are you sure you want to leave?`);
    //   }
    // } else {
    //   this.props.blockNavigation(false);
    // }
  };

  reset = () => {
    this.setState({
      jobName: '',
      yearsOfExperience: null,
      hoursOfTraining: null,
      jobDescription: null,
      selectedOffice: null,
      selectedEducation: [],
      selectedEligibility: [],
    })
  };

  onSave = () => {
    axios.post(jobs.create, {
      jobName: this.state.jobName,
      salaryGrade: this.state.salaryGrade,
      selectedOffice: this.state.selectedOffice,
      selectedEducation: this.state.selectedEducation,
      selectedEligibility: this.state.selectedEligibility,
      yearsOfExperience: this.state.yearsOfExperience,
      hoursOfTraining: this.state.hoursOfTraining,
      jobDescription: this.state.jobDescription
    })
      .then(res => {
        this.reset();
        if(res.data.status === 200) {
          this.props.history.push('/maintenance/applicants');
        }
      })
  };

  disabledChecker = () => {
    this.setState({saveDisabled: !(this.state.jobName.length > 9 && this.state.selectedOffice != null)})
  };

  render() {
    const jobsTitleBar =
      <div className={univStyles.titleBar + (this.props.location.pathname.includes('/new') ? ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Post new job</p>
              <a onClick={this.onCancel}>Cancel</a>
              <Button disabled={this.state.saveDisabled} onClick={this.onSave} width={70} classNames={['tertiary']} name="SAVE"/>
            </React.Fragment> :
            <React.Fragment>
              <p>Jobs</p>
              <Button onClick={this.onCreate} classNames={['primary']} name="+  POST NEW JOB"/>
            </React.Fragment>
        }
      </div>;

    const jobs = this.state.jobs.map(job => {
      return (
        <Col key={job.key} xs={4}>
          <Link to={'/maintenance/applicants/' + job.slug}>
            <div className={styles.jobs}>
              <p style={{fontSize: 14}}>{job.jobtitle}</p>
              <p className={styles.sub}>{job.count} employees</p>
            </div>
          </Link>
        </Col>
      )
    });

    return (
      <React.Fragment>
        {jobsTitleBar}
        <Switch>
          <Route path={'/maintenance/applicants'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Job listings</p>
                    <p className={univStyles.subtitle}>{this.state.jobs.length} jobs</p>
                    <SearchBar
                      placeholder="Search Jobs"
                      style={{
                        width: 170,
                        marginRight: 12,
                        marginLeft: 'auto'
                      }}/>
                  </div>
                  <div className={univStyles.formBody}>
                    <div style={{padding: 15}}>
                      <Container fluid style={{padding: 0, marginTop: -12}}>
                        <Row>
                          {jobs}
                        </Row>
                      </Container>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }/>
          <Route path={'/maintenance/applicants/new'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Job Details</p>
                  </div>
                  <div className={univStyles.formBody}>
                    <div style={{padding: 15}}>
                      <div className={univStyles.input}>
                        <Input
                          characterLimit={40}
                          autofocus
                          type="text"
                          value={this.state.jobName}
                          onChangeHandler={this.onChangeJobName}
                          name="* Job Name"/>
                      </div>
                      <div className={univStyles.input}>
                        <Select
                          value={this.state.selectedOffice}
                          isMulti
                          placeholder="* Office"
                          onChangeHandler={o => this.setState({selectedOffice: o})}
                          options={this.state.office}/>
                      </div>
                      <div className={univStyles.input}>
                        <Select
                          value={this.state.selectedEducation}
                          isMulti
                          isGroup
                          placeholder="Education"
                          onChangeHandler={o => this.setState({selectedEducation: o})}
                          options={this.state.education}/>
                      </div>
                      <div className={univStyles.input}>
                        <Select
                          value={this.state.selectedEligibility}
                          selected={this.state.selectedEducation}
                          isMulti
                          placeholder="Eligibility"
                          onChangeHandler={o => this.setState({selectedEligibility: o})}
                          options={this.state.eligibility}/>
                      </div>
                      <div className={univStyles.input}>
                        <Numeric onChangeHandler={this.onChangeSalaryGrade} width={200} name="Salary grade"/>
                      </div>
                      <div className={univStyles.input}>
                        <Numeric onChangeHandler={this.onChangeYearsOfExperience} width={200} name="Years of experience"/>
                      </div>
                      <div className={univStyles.input}>
                        <Numeric onChangeHandler={this.onChangeHoursOfTraining} width={200} name="Hours of relevant training"/>
                      </div>
                      <div className={univStyles.input}>
                        <TextArea
                          characterLimit={300}
                          value={this.state.jobDescription}
                          onChangeHandler={e => this.onChangeDescription(e)}
                          name="Job description"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
            </div>
          }/>
          <Route path={'/maintenance/applicants/:slug'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                {/*<Route path={'/maintenance/office/:slug'} exact component={}/>*/}
                <p>HAHAHA</p>
              </div>
            </div>
          }/>
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    employeeId: state.authentication.employeeId,
    firstName: state.authentication.firstName
  }
};

const mapDispatchToProps = dispatch => {
  return {
    blockNavigation:
      (value, message) => dispatch({
        type: actions.BLOCK_NAVIGATION,
        payload: {
          value,
          message
        }
      })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Jobs));
