import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';

import Aux from '../auxillary/auxillary';
import NavigationBar from './navigationBar/navigationBar';
import Announcements from './announcements/announcements';

class Home extends Component {
  state = {
    show: false
  };

  componentDidMount = () => {
    const socket = io('http://localhost:4000');

    socket.on('test', () => {
      this.setState({show: !this.state.show});
    })
  };

  render() {
    return (
      <Aux>
        {
          this.state.show ?
            <div style={{
              position: 'absolute',
              bottom: 15,
              left: 15,
              width: 400,
              height: 100,
              background: 'black',
              zIndex: 4
            }}/> : null
        }
        <NavigationBar />
        <Switch>
          <Route path="/announcements" exact component={Announcements}/>
          <Route path="/announcements/new" exact component={Announcements}/>
        </Switch>
      </Aux>
    );
  }
}

export default Home;
