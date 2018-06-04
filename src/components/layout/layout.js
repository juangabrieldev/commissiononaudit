import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Aux from '../auxillary/auxillary';
import Landing from '../landingPage/landingPage';
import Not from '../notFound/notFound';
import NotificationBar from '../notificationBar/notificationBar';
import CompleteRegistration from '../completeRegistration/completeRegistration';

import './layout.scss';

class Layout extends Component {

  render() {
    return (
      <Router>
        <Aux>
          <Switch>
            <Route path="/" exact component={Landing}/>
            <Route path="/get-started/login" exact component={Landing}/>
            <Route path="/get-started/register" exact component={Landing}/>
            <Route path="/complete-registration" component={CompleteRegistration}/>
            <Route component={Not}/>
          </Switch>
        </Aux>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.authentication.token
  }
};

export default connect(mapStateToProps, null)(Layout);