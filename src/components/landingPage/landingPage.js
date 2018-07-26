import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { TransitionGroup } from 'react-transition-group';

import Aux from '../auxillary/auxillary';
import CookieInfo from '../cookieInfo/cookieInfo';

import styles from './landingPage.scss';

import Getstarted from '../getStarted/getStarted';
import landing from '../../assets/landingPage/landing.svg';
import appIcon from '../../assets/landingPage/appIcon.svg';
import close from '../../assets/ui/close.svg';

class LandingPage extends Component {
  render() {
    const recents = JSON.parse(localStorage.getItem('recents'));
    let recentsComponent;

    if(recents != null) {
      recentsComponent = recents.map((recent, i) => (
        <div key={i} className={styles.recent}>
          <div className={styles.recentClose}>
            <img src={close} height={8} alt=""/>
          </div>
          <div className={styles.recentAvatar}>
            <img src="http://localhost:4000/images/2x2.png" onError={() => console.log('image error')} height={155} alt=""/>
          </div>
          <p className={styles.recentName}>{recent.name}</p>
        </div>
      ));
    }

    return(
      <DocumentTitle title="Welcome to Commission on Audit Promotion System">
        <Aux>
          <Getstarted toggle={() => this.props.history.push('/')} />
          <div className={styles.nav}>
            <div className={styles.inside}>
              <div className={styles.logo}>
                <img src={appIcon} height={45} alt=""/>
                <div className={styles.text}>
                  <p className={styles.com}>Commission on Audit</p>
                  <p className={styles.pms}>PROMOTION MANAGEMENT SYSTEM</p>
                </div>
              </div>
              <div className={styles.rightSide}>
                <div className={styles.li}>
                  <Link to="/get-started/login">LOG IN</Link>
                </div>
                <Link to="/get-started/register">
                  <div className={styles.c}>
                    CREATE ACCOUNT
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.topRightLine}/>
            <div className={styles.middleLine}/>
            <div className={styles.left}>
              <div className={styles.title}>
                <p>An <strong>all-in-one system</strong> to<br/> manage employees'<br/> application for promotion</p>
              </div>
              <div className={styles.desc}>
                <p>An all-in-one system to manage employees' <br/> application for promotion.</p>
              </div>
              <div className={styles.getStarted}>
                <Link to="/get-started/login">
                  <div className={styles.button}>
                    <p>GET STARTED</p>
                  </div>
                </Link>
              </div>
            </div>
            {
              recents != null ?
                <div className={styles.right}>
                  <div className={styles.recentContainer}>
                    <p className={styles.recentTitle}>Quick login</p>
                    <p className={styles.recentDesc}>Click your picture or add an account.</p>
                    <div className={styles.recents}>
                      {recentsComponent}
                    </div>
                  </div>
                </div> :
                <div className={styles.right}>
                  <img src={landing} height={320} alt=""/>
                </div>
            }
          </div>
        </Aux>
      </DocumentTitle>
    )
  }
}

export default LandingPage;
