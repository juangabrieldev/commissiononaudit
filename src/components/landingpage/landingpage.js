import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import Aux from '../auxillary/auxillary';

import styles from './landingpage.scss';

class Landingpage extends Component {
  render() {
    return(
      <DocumentTitle title="Welcome to Commission on Audit Promotion System">
        <Aux>
          <div className={styles.bg}/>
          <div className={styles.landingPage}>
            <div className={styles.welcome}>
              <div className={styles.main}>
                <p className={styles.w}>Welcome to</p>
                <p>Promotion Management <br/> System</p>
                <p className={styles.description}><em>An all-in-one system to manage employees' application papers for promotion.</em></p>
                <div className={styles.getStarted}>
                  <Link to="/get-started/login" ><button className={styles.getStartedButton}>Get started</button></Link>
                </div>
              </div>
            </div>
          </div>
        </Aux>
      </DocumentTitle>
    )
  }
}

export default Landingpage;
