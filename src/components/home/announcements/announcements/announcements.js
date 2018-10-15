import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";

import univStyles from '../../styles.scss'
import Button from "../../../button/button";
import SearchBar from "../../searchBar/searchBar";
import styles from "../../maintenance/office/office.scss";
import {Scrollbars} from "react-custom-scrollbars";

class Announcements extends Component {
  state = {
    announcements: [],
    previousLink: null
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/announcements/new')
  };

  onCancel = () => {
    this.props.history.push(this.state.previousLink);
  };

  render() {
    const announcementsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + (this.props.location.pathname.includes('/new') ? ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Create new employee</p>
              <a onClick={this.onCancel}>Cancel</a>
              <Button disabled={this.state.saveDisabled} onClick={this.onSave} width={70} classNames={['tertiary']} name="SAVE"/>
            </React.Fragment> :
            <React.Fragment>
              <p>Announcements</p>
              {
                this.props.role === 1 ?
                  <Button onClick={this.onCreate} classNames={['primary']} name="+  POST NEW ANNOUNCEMENT"/> :
                  null
              }
            </React.Fragment>
        }
      </div>;

    return (
      <Fragment>
        {announcementsTitleBar}
        <Switch>
          <Route path={'/announcements'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Announcements</p>
                    <p className={univStyles.subtitle}>{this.state.announcements.length} records</p>
                  </div>
                  <div className={univStyles.formBody}>

                  </div>
                </div>
              </div>
            </div>
          }/>
        </Switch>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.authentication.role
  }
};

export default withRouter(connect(mapStateToProps)(Announcements));
