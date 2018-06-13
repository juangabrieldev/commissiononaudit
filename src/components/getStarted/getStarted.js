import React, {Component} from 'react';
import produce from 'immer';
import { Link, Route, Switch, withRouter, Prompt } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../button/button';
import CheckBox from '../checkBox/checkBox';
import Input from '../input/input';
import Loadingbutton from '../loadingButton/loadingButton';

import styles from './getStarted.scss';

//import actionCreators
import { logIn } from '../../store/actions/authentication/authentication';

//import routes from api
import { employeeId, username } from './axios';

class GetStarted extends Component {
  state = {
    login: {
      username: '',
      password: ''
    },
    registration: {
      isValid: false,
      employeeId: {
        employeeId: '',
        isValid: '',
        validationMessage: ''
      },
      username: {
        username: '',
        isValid: '',
        validationMessage: ''
      },
      password: {
        password: '',
        isValid: '',
        validationMessage: ''
      },
    },
  };

  timer = null;

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleClickOutside = e => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      if(!this.props.isAuthenticating) {
        this.props.toggle();
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
      console.log('changed');
      this.setState(produce(draft => {
        draft.registration.username.username = ''
      }))
    }
  };

  formDisabled = !
    (
      this.state.registration.employeeId.isValid &&
      this.state.registration.username.isValid &&
      this.state.registration.password.isValid
    );

  onChangeUsernameHandler = (e, s) => {
    const value = e.target.value;

    switch (s) {
      case 1:
        this.setState(produce(draft => {
          draft.login.username = value;
        }));
        break;

      case 2:
        this.setState(produce(draft => {
          draft.registration.username.isValid = null;
          draft.registration.username.validationMessage = null;
          draft.registration.username.username = value
        }), () => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            if(value.length <= 7) {
              this.setState(produce(draft => {
                draft.registration.username.isValid = false;
                draft.registration.username.validationMessage = 'Username should be at least 8 characters.';
              }));
              return 0;
            }
            username.post('/', {
              username: this.state.registration.username.username
            })
              .then(res => {
                console.log(res);
                if(res.data.status === 200) {
                  this.setState(produce(draft => {
                    draft.registration.username.isValid = true;
                    draft.registration.username.validationMessage = res.data.validationMessage;
                  }))
                } else {
                  this.setState(produce(draft => {
                    draft.registration.username.isValid = false;
                    draft.registration.username.validationMessage = res.data.validationMessage;
                  }))
                }
              })
              .catch(e => {
                return e
              })
          }, 500);
        });
        break;

      default:
        break;
    }
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
          draft.registration.password.isValid = '';
        }), () => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.setState(produce(draft => {
              draft.registration.password.isValid = 7 < value.length;
              if(value.length < 8) {
                draft.registration.password.validationMessage = 'Password should be at least 8 characters.'
              } else draft.registration.password.validationMessage = 'Password is valid.'
            }));
          }, 500)
        });
        break;

      default:
        return null
    }
  };

  onChangeEmployeeIdHandler = e => {
    const reg = /^[0-9]*$/;
    const value = e.target.value;

    if(value.length > 7) return 0;

    this.setState(produce(draft => {
      draft.registration.employeeId.isValid = null;
      draft.registration.employeeId.validationMessage = null;
      if(value.length <= 7) {
        draft.registration.employeeId.employeeId = value
      }
    }), () => {
      if(reg.test(value) && value.length > 0) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            if(value.length < 7) {
              console.log('works');
              this.setState(produce(draft => {
                draft.registration.employeeId.isValid = false;
                draft.registration.employeeId.validationMessage = 'Employee ID should be 7 digits.'
              }));

              return 0;
            }
            employeeId.post('/', {
              employeeId: parseInt(this.state.registration.employeeId.employeeId)
            })
              .then(res => {
                console.log(res);
                if(res.data.status === 200) {
                  this.setState(produce(draft => {
                    draft.registration.employeeId.isValid = true;
                    draft.registration.employeeId.validationMessage = 'Employee ID is valid.' //
                  }));
                } else {
                  this.setState(produce(draft => {
                    draft.registration.employeeId.isValid = false;
                    draft.registration.employeeId.validationMessage = 'Invalid Employee ID.'
                  }));
                }
              })
              .catch(e => {
              })
          }, 800)
      } else {
        this.setState(produce(draft => {
          draft.registration.employeeId.isValid = false;
          draft.registration.employeeId.validationMessage = 'Employee ID should be a number';
        }))
      }
    });
  };

  onSubmit = (e, s, click) => {
    if(e.which === 13 || click) {
      switch (s) {
        case 1:
          if(this.state.login.username.length >= 1 && this.state.login.password.length >= 1) {
            this.props.logIn();
          }
      }
    }
  };

  render() {
    this.props.doneAuthenticating ?
      this.props.history.replace('/complete-registration') :
      null;

    const login =
      <div className={styles.getStarted} onKeyPress={e => this.onSubmit(e, 1)}>
        <div ref={this.setWrapperRef} className={styles.form}>
          <div className={styles.title}>
            <p><strong>Log in</strong><br/> to enter PMS</p>
          </div>
          <div className={styles.inside}>
            <Input value={this.state.login.username} onChangeHandler={e => this.onChangeUsernameHandler(e, 1)} autofocus={true} width={350} type="text" name="Username"/>
            <Input value="" onChangeHandler={e => this.onChangePasswordHandler(e, 1)} width={350} type="password" name="Password"/>
            <div className={styles.helper}>
              <CheckBox />
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
                    disabled={!(this.state.login.username.length > 0 && this.state.login.password.length > 0)}
                    type="submit"
                    width={150}
                    name="Continue"
                    classNames={['primary']} />
              }
            </div>
            <p className={styles.create}>or you can <Link to={'register'}>create an account</Link></p>
          </div>
        </div>
      </div>;

    const register =
      <div className={styles.getStarted} onKeyPress={e => this.onSubmit(e, 2)}>
        <div ref={this.setWrapperRef} className={styles.form}>
          <div className={styles.title}>
            <p><strong>Create</strong><br/>an account</p>
          </div>
          <div className={styles.inside}>
            <Input
              valid={
                this.state.registration.employeeId.employeeId.length > 0 ?
                  this.state.registration.employeeId.isValid :
                  null
              }
              validationMessage={this.state.registration.employeeId.validationMessage}
              value={this.state.registration.employeeId.employeeId}
              onChangeHandler={e => this.onChangeEmployeeIdHandler(e)}
              autofocus={true}
              maxLength={8}
              width={350}
              type="text"
              hideSpin={true}
              name="Employee ID"/>
            <Input
              value={this.state.registration.username.username}
              valid={
                this.state.registration.username.username.length > 0 ?
                  this.state.registration.username.isValid :
                  null
              }
              validationMessage={this.state.registration.username.validationMessage}
              onChangeHandler={e => this.onChangeUsernameHandler(e, 2)}
              width={350}
              type="text"
              name="Username"/>
            <Input
              valid={
                this.state.registration.password.password.length > 0 ?
                  this.state.registration.password.isValid : null
              }
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
                    complete={this.props.doneAuthenticating}
                    completeMessage="Welcome back" /> :
                  <Button
                    onClick={e => this.onSubmit(e, 2, true)}
                    disabled={!
                      (
                        this.state.registration.employeeId.isValid &&
                          this.state.registration.username.isValid &&
                          this.state.registration.password.isValid
                      )
                    }
                    type="submit"
                    width={150}
                    name="Next"
                    classNames={['primary']} />
              }
            </div>
            <p className={styles.create}>Already have an account? Log in <Link to={'login'}>here.</Link></p>
          </div>
        </div>
      </div>;

    return (
      <Switch>
        <Route exact key="login" path={'/get-started/login'} render={() => login}/>
        <Route exact key="register" path={'/get-started/register'} render={() => register}/>
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticating: state.authentication.isAuthenticating,
    doneAuthenticating: state.authentication.doneAuthenticating
  }
};

const mapDispatchToProps = dispatch => {
  return {
    logIn: (username, password) => dispatch(logIn(username, password))
  }
};

  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GetStarted));