import React, {Component} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Title from 'react-document-title';

import styles from './jobs.scss';

import Button from '../../button/button';
import SideBar from '../sideBar/sideBar';

class Jobs extends Component {
  state = {
    tabs: ['Jobs', 'Employees', 'Departments'],
    jobs: [{
      jobTitle: 'State Auditor V',
      jobDepartment: 'Human Resource',
      jobDescription: 'Lorem Ipsum',
      numberOfEmployees: 90
    }]
  };

  navigate = url => {
    this.props.history.push(this.props.match.path + '/' + url)
  };

  render() {
    const sideBarTabs =
      <React.Fragment>
        {
          this.state.tabs.map(tab => {
            let className = '';
            if(tab === 'Jobs' && this.props.location.pathname === '/' + tab.toLowerCase() || tab === 'Jobs' && this.props.location.pathname === '/' + tab.toLowerCase() + '/') {
              className = styles.active
            } else if(tab !== 'Jobs' && this.props.location.pathname.includes(tab.toLowerCase())) {
              className = styles.active
            }

            return (
            <p
              onClick={() => this.navigate(tab === 'Jobs' ? '' : tab.toLowerCase())}
              className={className}>
              {tab}
            </p>
            )
        })
        }
      </React.Fragment>;

    const jobsTitleBar =
      <div className={styles.titleBar + ' ' + (this.props.location.pathname.includes('/new') ? styles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Create new job</p>
              <Link to="/jobs">Cancel</Link>
            </React.Fragment> :
            <React.Fragment>
              <p>Jobs</p>
              <Button onClick={() => this.props.history.push('/jobs/new')} classNames={['primary']} name="+  CREATE NEW JOB"/>
            </React.Fragment>
        }
      </div>;

    const jobsListings = this.state.jobs.map(job => (
      <div className={styles.jobListing}>
        <p className={styles.jobTitle}>{job.jobTitle}</p>
        <p className={styles.jobDepartment}>{job.jobDepartment}</p>
        <p className={styles.jobDescription}>{job.jobDescription}</p>
      </div>
    ));

    const jobs =
      <React.Fragment>
        {jobsTitleBar}
          <Switch>
            <Route path={'/jobs'} exact render={() => (
              <div className={styles.main}>
                <div className={styles.page}>
                  <div className={styles.summary}>
                    <div className={styles.tab}>
                      <p className={styles.title}>TOTAL JOBS</p>
                      <p className={styles.sub}>0</p>
                    </div>
                    <div className={styles.divider}/>
                    <div className={styles.tab}>
                      <p className={styles.title}>TOTAL VACANCIES</p>
                      <p className={styles.sub}>0</p>
                    </div>
                    <div className={styles.divider}/>
                  </div>
                  <div className={styles.jobListings}>
                    <div className={styles.header}>
                      <p>Job Listings</p>
                    </div>
                    <div className={styles.jobListingsBody}>
                      {jobsListings}
                    </div>
                  </div>
                </div>
              </div>
            )}/>
            <Route path={'/jobs/new'} exact render={() => (
              <div className={styles.main}>
                <div className={styles.page + ' ' + styles.bottom} />
              </div>
            )}/>
          </Switch>
      </React.Fragment>;

    return (
      <div className={styles.jobs}>
        <SideBar>
          {sideBarTabs}
        </SideBar>
        <div className={styles.container}>
          <Switch>
            <Route path={this.props.match.path + '/'} exact render={() => jobs}/>
            <Route path={this.props.match.path + '/new'} exact render={() => jobs}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(Jobs);
