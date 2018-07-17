import React, {Component} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';

import styles from './announcements.scss';

import Aux from '../../auxillary/auxillary';
import Button from '../../button/button';
import SideBar from '../sideBar/sideBar';

class Announcements extends Component {
  render() {
    const titleBar =
      <div className={styles.titleBar + ' ' + (this.props.location.pathname.includes('/new') ? styles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Post new announcement</p>
              <Link to="/announcements">Cancel</Link>
            </React.Fragment> :
            <Aux>
              <p>Announcements</p>
              <Button onClick={() => this.props.history.push('/announcements/new')} classNames={['primary']} name="+  NEW ANNOUNCEMENT"/>
            </Aux>
        }
      </div>;

    return (
      <div className={styles.announcements}>
        <SideBar />
        <div className={styles.container}>
          <Switch>
            <Route path={this.props.match.path + '/'} exact render={() => titleBar}/>
            <Route path={this.props.match.path + '/new'} exact render={() => titleBar}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(Announcements);
