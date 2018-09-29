import React, {Component} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';

import Aux from '../auxillary/auxillary';
import Landing from '../landingPage/landingPage';
import LoginHelper from './loginHelper/loginHelper';
import Not from '../notFound/notFound';
import NotificationLeft from '../home/notificationLeft/notificationLeft';
import PrivateRoute from '../privateRoute/privateRoute';
import CompleteRegistration from '../completeRegistration/completeRegistration';
import Home from '../home/home';
import Toaster from '../toaster/toaster';

import './layout.scss';

class Layout extends Component {
  render() {
    const rootComponent = this.props.mode === 1 ?
      <PrivateRoute
        exact={true}
        myMode={1}
        path="/"
        secondRedirect="/get-started/verify"
        thirdRedirect="/complete-registration"
        fourthRedirect="/"
        component={Landing}
      /> :
      <PrivateRoute
        myMode={4}
        path="/"
        firstRedirect="/"
        secondRedirect="/get-started/verify"
        thirdRedirect="/complete-registration"
        fifthRedirect="/get-started/choose-role"
        component={Home}
      />;

    return (
      <Router>
        <Aux>
          <Switch>
            <PrivateRoute
              exact={true}
              myMode={1}
              path="/get-started/register"
              secondRedirect="/get-started/verify"
              thirdRedirect="/complete-registration"
              fourthRedirect="/"
              fifthRedirect="/get-started/choose-role"
              component={Landing}
            />
            <PrivateRoute
              exact={true}
              myMode={1}
              path="/get-started/login"
              secondRedirect="/get-started/verify"
              thirdRedirect="/complete-registration"
              fourthRedirect="/"
              fifthRedirect="/get-started/choose-role"
              component={Landing}
            />
            <PrivateRoute
              myMode={2}
              exact={true}
              path="/get-started/verify/"
              firstRedirect="/get-started/login"
              thirdRedirect="/complete-registration"
              fourthRedirect="/"
              fifthRedirect="/get-started/choose-role"
              component={Landing}
            />
            <PrivateRoute
              myMode={5}
              exact={true}
              path="/get-started/choose-role/"
              firstRedirect="/get-started/login"
              thirdRedirect="/complete-registration"
              fourthRedirect="/"
              fifthRedirect="/get-started/choose-role"
              component={Landing}
            />
            <PrivateRoute
              myMode={3}
              path="/complete-registration"
              firstRedirect="/"
              secondRedirect="/get-started/verify"
              fourthRedirect="/"
              fifthRedirect="/get-started/choose-role"
              component={CompleteRegistration}
            />
            {rootComponent}
            <Route component={Not}/>
          </Switch>
          <LoginHelper/>
          <NotificationLeft/>
          <Toaster />
        </Aux>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    mode: state.authentication.mode,
    employeeId: state.authentication.employeeId
  }
};

export default connect(mapStateToProps)(Layout);