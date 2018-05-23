import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Aux from '../auxillary/auxillary';
import Getstarted from '../getstarted/getstarted';
import Landing from '../landingpage/landingpage';
import Nav from '../navigationbar/navigationbar';

import './layout.scss';

class Layout extends Component {
  state = {};

  render() {
    return (
      <Router>
        <Aux>
          <Route path="/" component={Nav} />
          <Route path="/" exact component={Landing}/>
          <Route path="/get-started" component={Getstarted}/>
        </Aux>
      </Router>
    );
  }
}

export default Layout;
