import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { TransitionGroup } from 'react-transition-group';

import CookieInfo from '../cookieInfo/cookieInfo';
import Input from '../input/input';

import styles from './landingPage.scss';

import Getstarted from '../getStarted/getStarted';
import landing from '../../assets/landingPage/landing.svg';
import appIcon from '../../assets/landingPage/appIcon.svg';
import close from '../../assets/ui/close.svg';

class LandingPage extends Component {
  state = {
    quickLogin: {
      show: false,
      imageUrl: {
        hasUrl: false,
        color: ''
      },
      firstName: '',
      lastName: '',
      employeeId: '',
      password: ''
    }
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  removeRecent = (i, recents) => {
    recents.splice(i, 1);

    if(recents.length > 0) {
      localStorage.setItem('recents', JSON.stringify(recents));
    } else {
      localStorage.removeItem('recents')
    }

    setTimeout(() => this.forceUpdate(), 100);
  };

  onRecentClickHandler = (employeeId, firstName, lastName, imageUrl) => {
    this.setState({
      quickLogin: {
        show: true,
        imageUrl,
        employeeId,
        firstName,
        lastName
      }
    })
  };

  onChangePassword = e => {
    this.setState({
      quickLogin: {
        ...this.state.quickLogin,
        password: e.target.value
      }
    })
  };

  handleClickOutside = e => {
    if (this.refs.quick && !this.refs.quick.contains(e.target)) {
      this.setState({quickLogin: {
          ...this.state.quickLogin,
          show: false
      }})
    }
  };

  render() {
    const recents = JSON.parse(localStorage.getItem('recents'));
    const RecentsComponent = () => {
      if(recents != null) {
        return recents.map((recent, i) => (
            <div key={i} className={styles.recent}>
              <div onClick={() => this.removeRecent(i, recents)} className={styles.recentClose}>
                <img src={close} height={8} alt=""/>
              </div>
              <div onClick={() => this.onRecentClickHandler(recent.employeeId, recent.firstName, recent.lastName, recent.imageUrl)} className={styles.recentAvatar}>
                {
                  recent.imageUrl.hasUrl ?
                    <img src="http://localhost:4000/images/2x2.png" onError={() => console.log('image error')} height={155} alt=""/> :
                    <div
                      className={styles.recentAvatarInitials}
                      style={{
                      background: recent.imageUrl.color,
                      height: 155,
                      width: 155
                    }}>
                      <p>{recent.firstName.charAt(0)}{recent.lastName.charAt(0)}</p>
                    </div>
                }
              </div>
              <p className={styles.recentName}>{recent.firstName}</p>
            </div>
          ))
      }
    };

    const quickLogin = (
      <div className={styles.quickLogin}>
        <div ref="quick" className={styles.form}>
          <div className={styles.title}>
            <p><strong>Log in</strong><br/>as</p>
          </div>
          <div className={styles.inside}>
            <div className={styles.quickLoginAvatar}>
              <div className={styles.recent}>
                <div className={styles.recentAvatar}>
                  {
                    this.state.quickLogin.imageUrl.hasUrl ?
                      <img src="http://localhost:4000/images/2x2.png" onError={() => console.log('image error')} height={155} alt=""/> :
                      <div
                        className={styles.recentAvatarInitials}
                        style={{
                          background: this.state.quickLogin.imageUrl.color,
                          height: 155,
                          width: 155
                        }}>
                        <p className={styles.initials}>{this.state.quickLogin.firstName.charAt(0)}{this.state.quickLogin.lastName.charAt(0)}</p>
                      </div>
                  }
                </div>
                <p className={styles.recentName}>{this.state.quickLogin.firstName}</p>
              </div>
            </div>
            <Input
              onChangeHandler={this.onChangePassword}
              value={this.state.quickLogin.password}
              autofocus width={350}
              type="password"
              name="Password"/>
          </div>
        </div>
      </div>
    );

    return(
      <DocumentTitle title="Welcome to Commission on Audit Promotion System">
        <Fragment>
          {
            this.state.quickLogin.show ?
              quickLogin :
              null
          }
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
                      <RecentsComponent />
                    </div>
                  </div>
                </div> :
                <div className={styles.right}>
                  <img src={landing} height={320} alt=""/>
                </div>
            }
          </div>
        </Fragment>
      </DocumentTitle>
    )
  }
}

export default LandingPage;
