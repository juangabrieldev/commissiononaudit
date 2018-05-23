import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import Route from 'react-router-dom/es/Route';
import Link from 'react-router-dom/es/Link';
import Redirect from "react-router-dom/es/Redirect";

import Button from '../button/button';
import Input from '../input/input';

import styles from './getstarted.scss';

class Getstarted extends Component {
  state = {
    username: '',
    password: '',
    employeeID: '',
    confirmPassword: ''
  };

  onChangeUsernameHandler = e => {
    this.setState({username: e.target.value});
  };

  onChangePasswordHandler = e => {
    this.setState({password: e.target.value});
  };

  onChangeEmployeeIDHandler = e => {
    this.setState({password: e.target.value});
  };

  onSubmit = e => {
    if(e.which === 13) {
      if(this.state.disabled) {

      }
    }
  };

  render() {
    if(this.props.location.pathname === '/get-started/' || this.props.location.pathname === '/get-started') {
      return <Redirect to={`${this.props.match.path}/login`}/>
    }

    const login =
      <div className={styles.form} onKeyPress={e => this.onSubmit(e)}>
        <Input onChangeHandler={e => this.onChangeUsernameHandler(e)} autofocus={true} width={350} name="Username" type="text"/>
        <Input onChangeHandler={e => this.onChangePasswordHandler(e)} width={350} name="Password" type="password"/>
        <p className={styles.forgot}><Link to="">Forgot your password?</Link></p>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button disabled={!(this.state.username.length >= 1 && this.state.password.length >= 1)} type="submit" width={150} name="Continue" classNames={['primary', 'secondary']} />
        </div>
        <p className={styles.helper}>or <Link to="register">create an account.</Link></p>
        <p className={styles.helper}>Need help? Click <a href="">here.</a></p>
      </div>;

    const register =
      <div className={styles.form} onKeyPress={e => this.onSubmit(e)}>
        <Input onChangeHandler={e => this.onChangeEmployeeIDHandler(e)} requiredChar={8} autofocus={true} width={350} name="Employee ID" type="text"/>
        <Input onChangeHandler={e => this.onChangePasswordHandler(e)} width={350} name="Username" type="text"/>
        <Input onChangeHandler={e => this.onChangePasswordHandler(e)} width={350} name="Password" type="password"/>
        <Input onChangeHandler={e => this.onChangePasswordHandler(e)} width={350} name="Confirm password" type="password"/>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button disabled={!(this.state.username.length >= 1 && this.state.password.length >= 1)} type="submit" width={120} name="Next" classNames={['primary', 'secondary']} />
        </div>
        <p className={styles.switchToLogIn}>Already have an account? Log in <Link to="login">here.</Link></p>
      </div>;
    return (
      <DocumentTitle title="Get started">
        <div className={styles.main}>
          <div className={styles.header}>
            <div>
              {
                this.props.location.pathname.includes('/login') ?
                  <p><strong>Log in</strong><br/>to enter <strong>PMS</strong></p> :
                  <p><strong>Create</strong><br/>an account</p>
              }
            </div>
          </div>
          <div className={styles.inside}>
            <Route path={`${this.props.match.path}/login`} render={() => login} />
            <Route path={`${this.props.match.path}/register`} render={() => register} />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default Getstarted;
