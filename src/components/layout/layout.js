import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Aux from '../auxillary/auxillary';
import Landing from '../landingpage/landingpage';
import Not from '../notfound/notfound';

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
            <Route component={Not}/>
          </Switch>
        </Aux>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token
  }
};

export default connect(mapStateToProps)(Layout);