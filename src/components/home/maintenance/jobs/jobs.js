import React, {Component} from 'react';
import {Switch, Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';

import styles from './jobs.scss';

import Button from '../../../button/button';
import Dropdown from '../../../dropdown/dropdown';

import { office } from "../../../../api";
import univStyles from "../../styles.scss";
import SearchBar from "../../searchBar/searchBar";
import {Scrollbars} from "react-custom-scrollbars";
import {TransitionGroup} from "react-transition-group";
import Input from "../../../input/input";
import Numeric from "../../../numeric/numeric";
import TextArea from "../../../textarea/textArea";
import ViewOffice from "../office/viewOffice";
import * as actions from "../../../../store/actions/ui/actions";
import connect from "react-redux/es/connect/connect";

class Jobs extends Component {
  state = {
    jobs: [],
    previousLink: '/maintenance/jobs',
    jobName: null,
    yearsOfExperience: null,
    relevantTraining: null,
    jobDescription: null,
    education: [
      {
        type: 'group',
        name: 'SPECIFIC COURSES',
        items: [
          {
            value: 10,
            label: `Bachelor of Science in Civil Engineering`
          },
          {
            value: 23,
            label: 'Bachelor of Science in Electrical Engineering'
          }
        ]
      },
      {
        type: 'group',
        name: 'CUSTOM QUALIFICATION',
        items: [
          {
            value: 10,
            label: `Bachelor's Degree in Engineering`
          },
          {
            value: 23,
            label: 'Completion of two-year studies in college'
          }
        ]
      },
    ],
    educationDidSelect: false
  };

  componentDidMount = () => {
    axios.get(office.get + '?jobs=1')
      .then(res => {
        this.setState({departments: res.data.data})
      })
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/maintenance/jobs/new')
  };

  onCancel = () => {
    this.props.blockNavigation(false);
    setTimeout(() => {
      this.props.history.push(this.state.previousLink);
      this.setState({officeName: ''})
    }, 0);
  };

  onChangeEducation = o => {
    console.log(o)
    this.setState({selectedEducation: o, educationDidSelect: true})
  };

  onChangeJobName = e => {
    const value = e.target.value;

    this.setState({jobName: value}, () => {
      this.blockNavigationChecker();
      // this.disabledChecker()
    })
  };

  onChangeYearsOfExperience = v => {
    this.setState({yearsOfExperience: v}, () => {
      this.blockNavigationChecker();
    })
  };

  blockNavigationChecker = () => {
    if (this.state.jobName) {
      if (!this.props.blockedNavigation) {
        this.props.blockNavigation(true, `You haven't finished your post yet. Are you sure you want to leave?`);
      }
    } else {
      this.props.blockNavigation(false);
    }
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

    return (
      <React.Fragment>
        {jobsTitleBar}
        <Switch>
          <Route path={'/maintenance/jobs'} exact render={() =>
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
                    <div className={styles.header}>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          }/>
          <Route path={'/maintenance/jobs/new'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Job Details</p>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={styles.newBody}>
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
                        <Dropdown
                          isMulti
                          isSearchable
                          didSelect={this.state.educationDidSelect}
                          onChange={this.onChangeEducation}
                          options={this.state.education}
                          value={this.state.selectedEducation}
                          placeholder="Education"/>
                      </div>
                      <div className={univStyles.input}>
                        <Numeric onChangeHandler={this.onChangeYearsOfExperience} width={250} name={'Years of experience'}/>
                      </div>
                      <div className={univStyles.input}>
                        <Numeric width={250} name={'Hours of relevant training'}/>
                      </div>
                      <div className={univStyles.input}>
                        <TextArea characterLimit={300} value={this.state.officeDescription} onChangeHandler={e => this.onChangeDescription(e)} name="Job description"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
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
