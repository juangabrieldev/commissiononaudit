import React, {Component} from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Title from 'react-document-title';
import NavigationPrompt from 'react-router-navigation-prompt';
import { connect } from 'react-redux';

import NavigationBar from './navigationBar/navigationBar';
import Announcements from './announcements/announcements';
import Maintenance from './maintenance/maintenance';
import NavigationModal from '../navigationModal/navigationModal';
import SideBarRight from './sideBarRight/sideBarRight';

import * as actions from '../../store/actions/ui/actions';

class Home extends Component {
  afterConfirm = () => {
    this.props.blockNavigationDispatch(false);
  };

  render() {
    return (
      <React.Fragment>
        <NavigationPrompt afterConfirm={this.afterConfirm} when={this.props.blockNavigation}>
          {({onConfirm, onCancel}) => (
            <NavigationModal onConfirm={onConfirm} onCancel={onCancel} message={this.props.blockNavigationMessage} />
          )}
        </NavigationPrompt>
        <Title title="Commission on Audit Promotion Management System"/>
        <NavigationBar />
        <Switch>
          <Route path="/announcements" component={Announcements}/>
          <Route path="/maintenance" component={Maintenance}/>
        </Switch>
        {
          this.props.role === 1 ?
            <SideBarRight employeeId={this.props.employeeId}/> :
            null
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    blockNavigation: state.ui.blockNavigation,
    blockNavigationMessage: state.ui.blockNavigationMessage,
    employeeId: state.authentication.employeeId,
    role: state.authentication.role
  }
};

const mapDispatchToProps = dispatch => {
  return {
    blockNavigationDispatch:
        value => dispatch({
          type: actions.BLOCK_NAVIGATION,
          payload: {
            value
          }
        }),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
