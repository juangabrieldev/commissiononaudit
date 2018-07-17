import React, {Component} from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Title from 'react-document-title';
import io from 'socket.io-client';

import Aux from '../auxillary/auxillary';
import NavigationBar from './navigationBar/navigationBar';
import Announcements from './announcements/announcements';
import Jobs from './jobs/jobs';

class Home extends Component {
  componentDidMount = () => {
    const socket = io('http://localhost:4000');

    if(this.props.location.pathname === '/') {
      this.props.history.push('/announcements')
    }
  };

  render() {
    return (
      <Aux>
        <Title title="Commission on Audit Promotion Management System"/>
        <NavigationBar />
        <Switch>
          <Route path="/announcements" component={Announcements}/>
          <Route path="/maintenance" component={Jobs}/>
        </Switch>
      </Aux>
    );
  }
}

export default withRouter(Home);
