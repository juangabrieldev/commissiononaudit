import React, {Component} from 'react';
import {Switch, Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import connect from "react-redux/es/connect/connect";

import styles from './qualificationStandards.scss';

import Button from '../../../button/button';
import Dropdown from '../../../dropdown/dropdown';

import { office } from "../../../../api";
import univStyles from "../../styles.scss";
import SearchBar from "../../searchBar/searchBar";
import {Scrollbars} from "react-custom-scrollbars";
import {TransitionGroup} from "react-transition-group";
import Input from "../../../input/input";
import Numeric from "../../../numeric/numeric";

import * as actions from "../../../../store/actions/ui/actions";

class QualificationStandards extends Component {
  state = {

  };

  componentDidMount = () => {
    axios.get(office.get + '?jobs=1')
      .then(res => {
        this.setState({departments: res.data.data})
      })
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/maintenance/jobs/new')
  };

  onCancel = () => {
    this.props.blockNavigation(false);
    setTimeout(() => {
      this.props.history.push(this.state.previousLink);
      this.setState({officeName: ''})
    }, 0);
  };

  onChangeEducation = o => {
    console.log(o)
    this.setState({selectedEducation: o, educationDidSelect: true})
  };

  onChangeJobName = e => {
    const value = e.target.value;

    this.setState({jobName: value}, () => {
      this.blockNavigationChecker();
      // this.disabledChecker()
    })
  };

  onChangeYearsOfExperience = v => {
    this.setState({yearsOfExperience: v}, () => {
      this.blockNavigationChecker();
    })
  };

  blockNavigationChecker = () => {
    if (this.state.jobName) {
      if (!this.props.blockedNavigation) {
        this.props.blockNavigation(true, `You haven't finished your post yet. Are you sure you want to leave?`);
      }
    } else {
      this.props.blockNavigation(false);
    }
  };

  render() {
    const qualificationsTitleBar =
      <div className={univStyles.titleBar + (this.props.location.pathname.includes('/new') ? ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Post new job</p>
              <a onClick={this.onCancel}>Cancel</a>
              <Button disabled={this.state.saveDisabled} onClick={this.onSave} width={70} classNames={['tertiary']} name="SAVE"/>
            </React.Fragment> :
            <React.Fragment>
              <p>Qualification Standards</p>
            </React.Fragment>
        }
      </div>;

    return (
      <React.Fragment>
        {qualificationsTitleBar}
        <Switch>
          <Route path={'/maintenance/qualification-standards'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Qualification Standards</p>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={univStyles.groupOfFields}>
                      <p>Education</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }/>
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    employeeId: state.authentication.employeeId,
    firstName: state.authentication.firstName
  }
};

const mapDispatchToProps = dispatch => {
  return {
    blockNavigation:
      (value, message) => dispatch({
        type: actions.BLOCK_NAVIGATION,
        payload: {
          value,
          message
        }
      })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QualificationStandards));
