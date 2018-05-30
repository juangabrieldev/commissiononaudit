import React, {Component} from 'react';
import { Link, Route, Switch, Prompt } from 'react-router-dom';

import Button from '../button/button';
import Checkbox from '../checkbox/checkbox';
import Input from '../input/input';
import Loadingbutton from '../loadingbutton/loadingbutton';

import styles from './getstarted.scss';

class Getstarted extends Component {
  state = {
    authenticating: '',
    doneAuthenticating: '',
    login: {
      username: '',
      password: ''
    },
    registration: {
      employeeId: '',
      username: '',
      password: ''
    },

  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleClickOutside = e => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      if(!this.state.authenticating) {
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

  onChangeUsernameHandler = (e, s) => {
    const prevState = {...this.state};

    switch (s) {
      case 1:
        prevState.login.username = e.target.value;
        this.setState(prevState);
        break;
      case 2:
        prevState.registration.username = e.target.value;
        this.setState(prevState);
        break;
      default:
        break;
    }
  };

  onChangePasswordHandler = (e, s) => {
    const prevState = {...this.state};

    switch (s) {
      case 1:
        prevState.login.password = e.target.value;
        this.setState(prevState);
        break;
      case 2:
        prevState.registration.password = e.target.value;
        this.setState(prevState);
        break;
    }
  };

  onChangeEmployeeIDHandler = e => {
    const prevState = {...this.state};

    prevState.registration.employeeId = e.target.value;
    this.setState(prevState);
  };

  onSubmit = (e, s, click) => {
    if(e.which === 13 || click) {
      switch (s) {
        case 1:
          if(this.state.login.username.length >= 1 && this.state.login.password.length >= 1) {
            this.setState({authenticating: true});
            setTimeout(() => {
              this.setState({doneAuthenticating: true});
            }, 2000)
          }
      }
    }
  };

  render() {
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
              <Checkbox />
              <p>Keep me logged in.</p>
              <p><Link to="/">Forgot your password?</Link></p>
            </div>
            <div style={{
              margin: 20,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {
                this.state.authenticating ?
                  <Loadingbutton
                    width={150}
                    complete={this.state.doneAuthenticating}
                    completeMessage="Welcome back" /> :
                  <Button
                    onClick={e => this.onSubmit(e, 1, true)}
                    disabled={!(this.state.login.username.length > 0 && this.state.login.password.length > 0)}
                    type="submit"
                    width={150}
                    name="Continue"
                    classNames={['primary', 'secondary']} />
              }
            </div>
            <p className={styles.create}>or you can <Link to={'register'}>create an account</Link></p>
          </div>
        </div>
      </div>;

    const register =
      <div className={styles.getStarted}>
        <div ref={this.setWrapperRef} className={styles.form}>
          <div className={styles.title}>
            <p><strong>Create</strong><br/>an account</p>
          </div>
          <div className={styles.inside}>
            <Input value={this.state.registration.employeeId} onChangeHandler={e => this.onChangeEmployeeIDHandler(e)} autofocus={true} width={350} type="text" name="Employee ID"/>
            <Input value={this.state.registration.username} onChangeHandler={e => this.onChangeUsernameHandler(e, 2)} width={350} type="text" name="Username"/>
            <Input value={this.state.registration.password} onChangeHandler={e => this.onChangePasswordHandler(e, 2)} width={350} type="password" name="Password"/>
            <div style={{
              margin: 20,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {
                this.state.authenticating ?
                  <Loadingbutton
                    width={150}
                    complete={this.state.doneAuthenticating}
                    completeMessage="Welcome back" /> :
                  <Button
                    onClick={e => this.onSubmit(e, 2, true)}
                    disabled={!(this.state.login.username.length > 0 && this.state.login.password.length > 0)}
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

export default Getstarted;
