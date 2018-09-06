import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import CheckBox from "../checkBox/checkBox";
import Input from '../input/input';

import styles from './landingPage.scss';

import Getstarted from '../getStarted/getStarted';
import landing from '../../assets/landingPage/landing.svg';
import appIcon from '../../assets/landingPage/appIcon.svg';
import close from '../../assets/ui/close.svg';

import { authentication, publicFolder } from "../../api";

//import action creators
import { login, reset, keepMeLoggedIn } from '../../store/actions/authentication/authentication';

import Loadingbutton from "../loadingButton/loadingButton";
import Button from "../button/button";
import produce from "immer";
import Alert from "../alert/alert";

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
      localStorage.removeItem('recents');
    }

    setTimeout(() => {
      if(recents.length === 0) {
        window.location.reload()
      } else {
        this.forceUpdate();
      }
    }, 100);
  };

  onRecentClickHandler = (employeeId, firstName, lastName, imageUrl) => {
    this.setState({
      quickLogin: {
        ...this.state.quickLogin,
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
      this.props.reset();
      this.setState({quickLogin: {
          ...this.state.quickLogin,
          password: '',
          show: false
      }})
    }
  };

  onSubmit = (e, click) => {
    if(e.which === 13 || click) {
      if(this.state.quickLogin.password.length > 0) {
        this.props.login(this.state.quickLogin.employeeId, this.state.quickLogin.password);
      }
    }
  };

  render() {
    const recents = JSON.parse(localStorage.getItem('recents'));
    const RecentsComponent = () => {
      if(recents != null) {
        return recents.map((recent, i, a) => (
          <Fragment key={i}>
            <div className={styles.recent}>
              <div onClick={() => this.removeRecent(i, recents)} className={styles.recentClose}>
                <img src={close} height={8} alt=""/>
              </div>
              <div onClick={() => this.onRecentClickHandler(recent.employeeId, recent.firstName, recent.lastName, recent.imageUrl)} className={styles.recentAvatar}>
                {
                  recent.imageUrl.hasUrl ?
                    <img src={publicFolder.images + recent.imageUrl.url} height={155} alt=""/> :
                    <div
                      className={styles.recentAvatarInitials}
                      style={{
                        background: recent.imageUrl.color,
                        height: 155,
                        width: 155
                      }}>
                      <p className={styles.initials}>{recent.firstName.charAt(0)}{recent.lastName.charAt(0)}</p>
                    </div>
                }
              </div>
              <p className={styles.recentName}>{recent.firstName}</p>
            </div>
            {
              i === a.length - 1 && a.length === 1 ?
                <Link to="/get-started/login">
                  <div className={styles.addAccount}>
                    <div className={styles.iconContainer}>
                      <div className={styles.vertical} />
                      <div className={styles.horizontal} />
                    </div>
                    <p>Add account</p>
                  </div>
                </Link> :
                null
            }
            {
              a.length > 1
            }
          </Fragment>
        ))
      }
    };

    const quickLogin = (
      <div className={styles.quickLogin}>
        <div ref="quick" className={styles.form} >
          <div className={styles.title}>
            <p><strong>Log in</strong><br/>as</p>
          </div>
          <div className={styles.inside} onKeyPress={e => this.onSubmit(e)}>
            <div className={styles.quickLoginAvatar}>
              <div className={styles.recent}>
                <div className={styles.recentAvatar}>
                  {
                    this.state.quickLogin.imageUrl.hasUrl ?
                      <img src={publicFolder.images + this.state.quickLogin.imageUrl.url} onError={() => console.log('image error')} height={155} alt=""/> :
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
            {
              this.props.authenticationSuccessful === false && this.props.notYetRegisteredEmployeeId == null ?
                <div style={{padding: 20, paddingBottom: 4}}>
                  <Alert type="error" message={this.props.authenticationMessage}/>
                </div> :
                null
            }
            <Input
              onChangeHandler={this.onChangePassword}
              value={this.state.quickLogin.password}
              autofocus width={350}
              type="password"
              name="Password"/>
            <div className={styles.helper}>
              <CheckBox toggle={v => this.keepMeLoggedIn(v)}/>
              <p>Keep me logged in.</p>
              <p><Link to="/">Forgot your password?</Link></p>
            </div>
            <div style={{
              margin: 20,
              marginBottom: 0,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {
                this.props.isAuthenticating ?
                  <Loadingbutton
                    width={150}
                    complete={this.props.doneAuthenticating} /> :
                  <Button
                    onClick={e => this.onSubmit(e, true)}
                    disabled={!(this.state.quickLogin.password.length > 0)}
                    type="submit"
                    width={150}
                    name="CONTINUE"
                    classNames={['tertiary']} />
              }
            </div>
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

const mapStateToProps = state => {
  return {
    isAuthenticating: state.authentication.isAuthenticating,
    authenticationSuccessful: state.authentication.authenticationSuccessful,
    authenticationMessage: state.authentication.authenticationMessage,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    login: (employeeId, password) => dispatch(login(employeeId, password)),
    keepMeLoggedIn: v => dispatch(keepMeLoggedIn(v)),
    reset: () => dispatch(reset())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
