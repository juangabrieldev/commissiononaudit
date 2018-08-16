import React, {Component, Fragment} from 'react';
import {Switch, Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import connect from "react-redux/es/connect/connect";
import { Container, Row, Col, setConfiguration } from 'react-grid-system';

import styles from './qualificationStandards.scss';

import Button from '../../../button/button';
import Dropdown from '../../../dropdown/dropdown';

import {office, qualificationStandards} from "../../../../api";
import univStyles from "../../styles.scss";
import SearchBar from "../../searchBar/searchBar";
import {Scrollbars} from "react-custom-scrollbars";
import {TransitionGroup} from "react-transition-group";
import Input from "../../../input/input";
import Numeric from "../../../numeric/numeric";

import edit from '../../../../assets/ui/editPencil.svg';

import * as actions from "../../../../store/actions/ui/actions";

setConfiguration({ gutterWidth: 15 });

class QualificationStandards extends Component {
  state = {
    specificCourses: [],
    customQualifications: [],
    trainings: [],
    eligibilities: []
  };

  componentDidMount = () => {
    this.fetch();
  };

  fetch = () => {
    axios.get(qualificationStandards.get)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            specificCourses: res.data.data.educationSpecific,
            customQualifications: res.data.data.educationCustom,
            trainings: res.data.data.trainings,
            eligibilities: res.data.data.eligibilities
          }, () => console.log(this.state))
        }
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
    console.log(o);
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

    const specificCourses = this.state.specificCourses.map((course, i, a) => (
      <Fragment key={course.key}>
        <Col xs={4}>
          <div style={{marginTop: 15}} className={univStyles.fields}>
            <p className={univStyles.onlyContent}>{course.name}</p>
            <div className={univStyles.edit}>
              <p>EDIT</p>
            </div>
          </div>
        </Col>
        {
          i === a.length - 1 ?
            <Col xs={4}>
              <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <Link to="/heys">SPECIFIC COURSE</Link></p>
              </div>
            </Col> :
            null
        }
      </Fragment>
    ));

    const customQualifications = this.state.customQualifications.map((custom, i, a) => (
      <Fragment key={custom.key}>
        <Col xs={4}>
          <div style={{marginTop: 15}} className={univStyles.fields}>
            <p className={univStyles.onlyContent}>{custom.name}</p>
            <div className={univStyles.edit}>
              <p>EDIT</p>
            </div>
          </div>
        </Col>
        {
          i === a.length - 1 ?
            <Col xs={4}>
              <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <Link to="/heys">CUSTOM QUALIFICATION</Link></p>
              </div>
            </Col> :
            null
        }
      </Fragment>
    ));

    const trainings = this.state.trainings.map((training, i, a) => (
      <Fragment key={training.key}>
        <Col xs={4}>
          <div style={{marginTop: 15}} className={univStyles.fields}>
            <p className={univStyles.onlyContent}>{training.name}</p>
            <div className={univStyles.edit}>
              <p>EDIT</p>
            </div>
          </div>
        </Col>
        {
          i === a.length - 1 ?
            <Col xs={4}>
              <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <Link to="/heys">TRAINING</Link></p>
              </div>
            </Col> :
            null
        }
      </Fragment>
    ));

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
                    <div style={{padding: 15}}>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Specific courses</p>
                          <Container fluid style={{padding: 0, marginTop: -12}}>
                            <Row>
                              {specificCourses}
                            </Row>
                          </Container>
                      </div>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Custom qualifications</p>
                          <Container fluid style={{padding: 0, marginTop: -12}}>
                            <Row>
                              {customQualifications}
                            </Row>
                          </Container>
                      </div>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Trainings</p>
                        <Container fluid style={{padding: 0, marginTop: -12}}>
                          <Row>
                            {trainings}
                          </Row>
                        </Container>
                      </div>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Eligibilities</p>
                      </div>
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
