import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";

import univStyles from '../styles.scss';

class Applications extends Component {
  state = {
    tabs: ['My applications'],
    overflowHidden: false,
    zeroTop: false
  };

  render() {
    const sideBarTabs =
      <Fragment>
        {

        }
      </Fragment>
  }
}

export default Applications;
