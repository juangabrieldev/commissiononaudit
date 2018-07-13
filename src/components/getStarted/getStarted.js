import React, {Component} from 'react';
import axios from 'axios';
import validator from 'email-validator';
import produce from 'immer';
import z from 'zxcvbn';
import {Link, Route, Switch, withRouter, Prompt, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Alert from '../alert/alert';
import Button from '../button/button';
import CheckBox from '../checkBox/checkBox';
import Input from '../input/input';
import Loadingbutton from '../loadingButton/loadingButton';

import styles from './getStarted.scss';

import email from '../../assets/ui/email.svg';
import employee from '../../assets/ui/employee.svg';

//import actionCreators
import { login, register, reset, keepMeLoggedIn } from '../../store/actions/authentication/authentication';

//import routes from api
import { authentication } from '../../api';

class GetStarted extends Component {
  state = {
    login: {
      employeeId: '',
      password: ''
    },
    registration: {
      employeeId: {
        employeeId: '',
        isValid: null,
        validationMessage: null
      },
      email: {
        email: '',
        isValid: null,
        validationMessage: null
      },
      password: {
        password: '',
        passwordStrength: null,
        isValid: null,
        validationMessage: null
      },
    },
    role: null
  };

  timer = null;

  handleClickOutside = e => {
    if (this.refs.form && !this.refs.form.contains(e.target)) {
      if(!this.props.isAuthenticating) {
        this.props.history.push('/');
      }
    }
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  componentDidUpdate = prevProps => {
    if(prevProps.location !== this.props.location) {
      this.setState(produce(draft => {
        draft.registration.employeeId.employeeId = '';
        draft.registration.password.password = '';
        draft.registration.email.email = '';
        draft.login.employeeId = '';
        draft.login.password = '';
      }));

      this.props.reset();

      const { q } = queryString.parse(this.props.location.search);

      let e = {
        target: {
          value: ''
        }
      };

      if(q != null) {
        e.target.value = q;
        this.onChangeEmployeeIdHandler(e, 2);
      }
    }
  };

  onChangeEmailHandler = (e) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.registration.email.isValid = null;
      draft.registration.email.validationMessage = null;
      draft.registration.email.email = value
    }), () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if(validator.validate(value)) {
          axios.post(authentication.registration, {
            mode: 2,
            email: value
          })
            .then(res => {
              if(res.data.status === 200) {
                this.setState(produce(draft => {
                  draft.registration.email.isValid = true;
                  draft.registration.email.validationMessage = res.data.validationMessage;
                }))
              } else {
                this.setState(produce(draft => {
                  draft.registration.email.isValid = false;
                  draft.registration.email.validationMessage = res.data.validationMessage;
                }))
              }
            })
        } else {
          this.setState(produce(draft => {
            draft.registration.email.isValid = false;
            draft.registration.email.validationMessage = 'Please enter a valid e-mail address';
          }))
        }
      }, 500)
    })
  };

  onChangePasswordHandler = (e, s) => {
    const value = e.target.value;
    switch (s) {
      case 1:
        this.setState(produce(draft => {
          draft.login.password = value;
        }));
        break;

      case 2:
        this.setState(produce(draft => {
          draft.registration.password.password = value;
          draft.registration.password.validationMessage = null;
          draft.registration.password.passwordStrength = null;

          const forb = [this.state.registration.employeeId.employeeId, this.state.registration.email.email];
          const zxc = z(value, forb);

          draft.registration.password.passwordStrength = zxc.score;
          draft.registration.password.isValid = zxc.score > 0;

          switch (zxc.score) {
            case 0:
              draft.registration.password.validationMessage = 'Too weak password';
              break;
            case 1:
              draft.registration.password.validationMessage = 'Weak password';
              break;
            case 2:
              draft.registration.password.validationMessage = 'Okay password';
              break;
            case 3:
              draft.registration.password.validationMessage = 'Strong password';
              break;
            case 4:
              draft.registration.password.validationMessage = 'Very strong password';
              break;
            default:
              break;
          }
        }));
        break;

      default:
        return null
    }
  };

  onChangeEmployeeIdHandler = (e, s) => {
    const reg = /^[0-9]*$/;
    const value = e.target.value;

    if(value.length > 7) return 0;

    switch(s) {
      case 1: {
        if(reg.test(value) && value.length < 8) {
          this.setState(produce(draft => {
            draft.login.employeeId = value;
          }))
        }
        break;
      }

      case 2: {
        this.setState(produce(draft => {
          draft.registration.employeeId.isValid = null;
          draft.registration.employeeId.validationMessage = null;
          if(value.length <= 7) {
            draft.registration.employeeId.employeeId = value
          }
        }), () => {
          if(reg.test(value) && value.length > 0 ) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              if(value.length < 7 && value.length !== 0) {
                this.setState(produce(draft => {
                  draft.registration.employeeId.isValid = false;
                  draft.registration.employeeId.validationMessage = 'Employee ID should be 7 digits'
                }));

                return 0;
              }
              axios.post(authentication.registration, {
                mode: 1,
                employeeId: parseInt(this.state.registration.employeeId.employeeId, 10)
              })
                .then(res => {
                  if(res.data.status === 200) {
                    this.setState(produce(draft => {
                      draft.registration.employeeId.isValid = true;
                      draft.registration.employeeId.validationMessage = res.data.validationMessage;
                    }));
                  } else {
                    this.setState(produce(draft => {
                      draft.registration.employeeId.isValid = false;
                      draft.registration.employeeId.validationMessage = res.data.validationMessage
                    }));
                  }
                })
                .catch(e => {
                })
            }, 500)
          } else {
            this.setState(produce(draft => {
              if(value.length > 0) {
                draft.registration.employeeId.isValid = false;
                draft.registration.employeeId.validationMessage = 'Employee ID should be a number';
              } else {
                draft.registration.employeeId.isValid = null;
                draft.registration.employeeId.validationMessage = null;
              }

            }))
          }
        });
        break;
      }

      default:
        break;
    }
  };

  keepMeLoggedIn = v => {
    this.props.keepMeLoggedIn(v)
  };

  onSubmit = (e, s, click) => {
    if(e.which === 13 || click) {
      switch (s) {
        case 1:
          if(this.state.login.employeeId.length >= 1 && this.state.login.password.length >= 1) {
            this.props.login(this.state.login.employeeId, this.state.login.password);
          }
        break;

        case 2:
          if(this.state.registration.employeeId.isValid && this.state.registration.email.isValid && this.state.registration.password.isValid) {
            this.props.register(this.state.registration.employeeId.employeeId, this.state.registration.email.email, this.state.registration.password.password);
          }
      }
    }
  };

  render() {
    const login =
      <div className={styles.getStarted} onKeyPress={e => this.onSubmit(e, 1)}>
        <div ref="form" className={styles.form}>
          <div className={styles.title}>
            <p><strong>Log in</strong><br/> to enter PMS</p>
          </div>
          {
            this.props.authenticationSuccessful === false ?
              <Alert type="error" message={this.props.authenticationMessage} employeeId={this.props.notYetRegisteredEmployeeId}/> :
              null
          }
          <div className={styles.inside}>
            <Input value={this.state.login.employeeId} onChangeHandler={e => this.onChangeEmployeeIdHandler(e, 1)} autofocus={true} width={350} type="text" name="Employee ID"/>
            <Input value={this.state.login.password} onChangeHandler={e => this.onChangePasswordHandler(e, 1)} width={350} type="password" name="Password"/>
            <div className={styles.helper}>
              <CheckBox toggle={v => this.keepMeLoggedIn(v)}/>
              <p>Keep me logged in.</p>
              <p><Link to="/">Forgot your password?</Link></p>
            </div>
            <div style={{
              margin: 20,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {
                this.props.isAuthenticating ?
                  <Loadingbutton
                    width={150}
                    complete={this.props.doneAuthenticating}
                    completeMessage="Welcome back" /> :
                  <Button
                    onClick={e => this.onSubmit(e, 1, true)}
                    disabled={!(this.state.login.employeeId.length > 0 && this.state.login.password.length > 0)}
                    type="submit"
                    width={150}
                    name="CONTINUE"
                    classNames={['tertiary']} />
              }
            </div>
            <p className={styles.create}>or you can <Link to={'register'}>create an account.</Link></p>
          </div>
        </div>
      </div>;

    const register =
      <div className={styles.getStarted} onKeyPress={e => this.onSubmit(e, 2)}>
        <div ref="form" className={styles.form}>
          <div className={styles.title}>
            <p><strong>Create</strong><br/>an account</p>
          </div>
          <div className={styles.inside}>
            <Input
              myKey={1}
              valid={
                this.state.registration.employeeId.employeeId.length > 0 ?
                  this.state.registration.employeeId.isValid :
                  null
              }
              validationMessage={this.state.registration.employeeId.validationMessage}
              value={this.state.registration.employeeId.employeeId}
              onChangeHandler={e => this.onChangeEmployeeIdHandler(e, 2)}
              autofocus={true}
              maxLength={8}
              width={350}
              type="text"
              hideSpin={true}
              name="Employee ID"/>
            <Input
              myKey={2}
              value={this.state.registration.email.email}
              valid={
                this.state.registration.email.email.length > 0 ?
                  this.state.registration.email.isValid :
                  null
              }
              validationMessage={this.state.registration.email.validationMessage}
              onChangeHandler={e => this.onChangeEmailHandler(e)}
              width={350}
              type="email"
              name="E-mail address"/>
            <Input
              myKey={3}
              valid={
                this.state.registration.password.password.length > 0 ?
                  this.state.registration.password.isValid :
                  null
              }
              passwordStrength={this.state.registration.password.passwordStrength}
              validationMessage={this.state.registration.password.validationMessage}
              value={this.state.registration.password.password}
              onChangeHandler={e => this.onChangePasswordHandler(e, 2)}
              width={350}
              type="password"
              name="Password"/>
            <div style={{
              margin: 20,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {
                this.props.isAuthenticating ?
                  <Loadingbutton
                    width={150}
                    complete={this.props.authenticationSuccessful}
                    completeMessage="Success" /> :
                  <Button
                    onClick={e => this.onSubmit(e, 2, true)}
                    disabled={!
                      (
                        this.state.registration.employeeId.isValid &&
                          this.state.registration.email.isValid &&
                          this.state.registration.password.isValid
                      )
                    }
                    type="submit"
                    width={150}
                    name="NEXT"
                    classNames={['tertiary']} />
              }
            </div>
            <p className={styles.create}>Already have an account? Log in <Link to={'login'}>here.</Link></p>
          </div>
        </div>
      </div>;

    const verify =
      <div className={styles.getStarted}>
        <div className={styles.form}>
          <div className={styles.emailContainer}>
            <div className={styles.left}>
              <img src={email} alt="" height={150}/>
            </div>
            <div className={styles.right}>
              <p className={styles.emailTitle}>Verify your e-mail</p>
              <p className={styles.emailDescription}>
                Hi, <span>{this.props.firstName}!</span> Please verify your e-mail address so you can
                sign in if you ever
                forget your password. We've
                sent a confirmation link to: <span>{this.props.email}</span>
              </p>
            </div>
          </div>
          <div className={styles.resendContainer}>
            <p>If you still don't see it, take a look at <strong>spam</strong> section, or you can <strong>resend the confirmation link.</strong></p>
          </div>
        </div>
      </div>;

    const chooseRole =
      <div className={styles.getStarted}>
        <div className={styles.form}>
          <div className={styles.loginAsContainer}>
            <div className={styles.loginAsTitle}>
              <p>Choose your role</p>
            </div>
            <div className={styles.roles}>
              <div
                onClick={() => this.setState({role: 'user'})}
                className={styles.box + (this.state.role === 'user' ? ' ' + styles.roleSelected : '')}>
                <img src={employee} height={130} alt=""/>
                <p>User</p>
              </div>
              <div
                onClick={() => this.setState({role: 'admin'})}
                className={styles.box + (this.state.role === 'admin' ? ' ' + styles.roleSelected : '')}>
                <img src={employee} height={130} alt=""/>
                <p>Administrator</p>
              </div>
            </div>
            <div className={styles.button}>
              <Button classNames={['tertiary']} width={100} name="Proceed"/>
            </div>
          </div>
        </div>
      </div>;

    return (
      <Switch>
        <Route exact key="login" path={'/get-started/login'} render={() => login}/>
        <Route exact key="register" path={'/get-started/register'} render={() => register}/>
        <Route exact key="verify" path={'/get-started/verify'} render={() => verify}/>
        <Route exact key="chooseRole" path={'/get-started/choose-role'} render={() => chooseRole}/>
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticating: state.authentication.isAuthenticating,
    authenticationSuccessful: state.authentication.authenticationSuccessful,
    mode: state.authentication.mode,
    firstName: state.authentication.firstName,
    email: state.authentication.email,
    authenticationMessage: state.authentication.authenticationMessage,
    notYetRegisteredEmployeeId: state.authentication.notYetRegisteredEmployeeId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    login: (employeeId, password) => dispatch(login(employeeId, password)),
    register: (employeeid, email, password) => dispatch(register(employeeid, email, password)),
    keepMeLoggedIn: v => dispatch(keepMeLoggedIn(v)),
    reset: () => dispatch(reset())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GetStarted));