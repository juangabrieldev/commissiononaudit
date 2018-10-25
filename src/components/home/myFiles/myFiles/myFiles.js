import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

import univStyles from '../../styles.scss'
import {Col, Container, Row} from "react-grid-system";
import styles from "../../applications/applications/styles.scss";
import ReactSVG from "react-svg";
import jobIcon from "../../../../assets/ui/jobs.svg";

class MyFiles extends Component {
  state = {};

  render() {
    const myFilesTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>
          My files
        </p>
      </div>;

    return (
      <Fragment>
        {myFilesTitleBar}
        <div className={univStyles.main}>
          <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
          <div className={univStyles.pageMain}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>
                  Recent files
                </p>
              </div>
              <div className={univStyles.formBody} style={{padding: 15, position: 'relative'}}>
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
    role: state.authentication.role,
    employeeId: state.authentication.employeeId
  }
};

export default withRouter(connect(mapStateToProps)(MyFiles));

