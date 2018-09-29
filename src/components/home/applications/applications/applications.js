import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";

import univStyles from '../../styles.scss'
import Button from "../../../button/button";
import SearchBar from "../../searchBar/searchBar";
import styles from "../../maintenance/office/office.scss";
import {Scrollbars} from "react-custom-scrollbars";

class Applications extends Component {
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
    const applicationsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>
          {
            this.props.role === 2 ?
              'My applications' :
              'Applications'
          }
        </p>
      </div>;

    return (
      <Fragment>
        {applicationsTitleBar}
          <div className={univStyles.main}>
            <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
            <div className={univStyles.pageMain}>
              <div className={univStyles.form}>
                <div className={univStyles.header}>
                  <p>
                    {
                      this.props.role === 2 ?
                        'My applications' :
                        'Applications'
                    }
                  </p>
                  {
                    
                  }
                  {/*<p className={univStyles.subtitle}>{this.state.announcements.length} records</p>*/}
                </div>
                <div className={univStyles.formBody}>

                </div>
              </div>
            </div>
          </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.authentication.role
  }
};

export default withRouter(connect(mapStateToProps)(Applications));

