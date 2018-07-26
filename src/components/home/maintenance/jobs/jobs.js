import React, {Component} from 'react';
import { Switch, Route, Link  } from 'react-router-dom';

import styles from './jobs.scss';
import modular from '../maintenance.scss';

import Button from '../../../button/button';

class Jobs extends Component {
  state = {};

  render() {
    const jobsTitleBar =
      <div className={modular.titleBar + ' ' + (this.props.location.pathname.includes('/new') ? modular.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Create new job</p>
              <Link to="/maintenance/jobs">Cancel</Link>
            </React.Fragment> :
            <React.Fragment>
              <p>Jobs</p>
              <Button onClick={() => this.props.history.push('/maintenance/jobs/new')} classNames={['primary']} name="+  CREATE NEW JOB"/>
            </React.Fragment>
        }
      </div>;

    // const jobsListings = this.state.jobs.map(job => (
    //   <div className={styles.jobListing}>
    //     <p className={styles.jobTitle}>{job.jobTitle}</p>
    //     <p className={styles.jobDepartment}>{job.jobDepartment}</p>
    //     <p className={styles.jobDescription}>{job.jobDescription}</p>
    //   </div>
    // ));

    return (
      <React.Fragment>
        {jobsTitleBar}
        <Switch>
          <Route path={'/maintenance/jobs'} exact render={() => (
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
                    {}
                  </div>
                </div>
              </div>
            </div>
          )}/>
          <Route path={'/maintenance/jobs/new'} exact render={() => (
            <div className={styles.main}>
              <div className={styles.page + ' ' + styles.bottom} />
            </div>
          )}/>
        </Switch>
      </React.Fragment>
    );
  }
}

export default Jobs;
