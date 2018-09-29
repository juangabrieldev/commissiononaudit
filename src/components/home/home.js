import React, {Component} from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Title from 'react-document-title';
import NavigationPrompt from 'react-router-navigation-prompt';
import { connect } from 'react-redux';
import ReactNoUnmountHide from 'react-no-unmount-hide';

import DeleteConfirmationModal from '../confirmationModal/deleteConfirmationModal';
import NavigationBar from './navigationBar/navigationBar';
import Announcements from './announcements/announcements';
import Applications from './applications/applications';
import Maintenance from './maintenance/maintenance';
import NavigationModal from '../navigationModal/navigationModal';
import SideBarRight from './sideBarRight/sideBarRight';
import NotFound from '../notFound/notFound';

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
        {
          this.props.notFound ?
            <NotFound onClick={this.props.disableNotFound} link={this.props.notFoundHome}/> :
            null
        }
        <div style={{display: this.props.notFound ? 'none' : null}}>
          <Switch>
            <Route path="/announcements" component={Announcements}/>
            <Route path="/maintenance" component={Maintenance}/>
            <Route path="/applications" component={Applications}/>
          </Switch>
        </div>
        {
          this.props.role === 7 ?
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
    showConfirmationModal: state.ui.showConfirmationModal,
    employeeId: state.authentication.employeeId,
    role: state.authentication.role,
    notFoundHome: state.ui.notFoundHome,
    notFound: state.ui.notFound
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
    disableNotFound: () => dispatch({type: actions.DISABLE_NOT_FOUND})
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
