import React, {Component, Fragment} from 'react';
import {Switch, Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import connect from "react-redux/es/connect/connect";
import { Container, Row, Col, setConfiguration } from 'react-grid-system';
import produce from 'immer';

import styles from './qualificationStandards.scss';

import Button from '../../../button/button';
import Select from '../../../select/select';

import {qualificationStandards} from "../../../../api";
import {events, initializeSocket} from "../../../../socket";
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
    specificCourses: {
      data: [],
      add: false
    },
    customQualifications: {
      data: [],
      add: false
    },
    trainings: {
      data: [],
      add: false
    },
    eligibilities: {
      data: [],
      add: false
    }
  };

  componentDidMount = () => {
    this.fetch();
    document.addEventListener('mousedown', this.handleClickOutside);

    const socket = initializeSocket();

    socket.on(events.qualificationStandards, this.fetch)
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  fetch = () => {
    axios.get(qualificationStandards.get)
      .then(res => {
        if(res.data.status === 200) {
          this.setState(produce(draft => {
            draft.specificCourses.data = res.data.data.educationSpecific;
            draft.customQualifications.data = res.data.data.educationCustom;
            draft.trainings.data = res.data.data.trainings;
            draft.eligibilities.data = res.data.data.eligibilities;
          }))
        }
      })
  };

  onAdd = s => {
    switch(s) {
      case 1: {
        this.setState(produce(draft => {
          draft.specificCourses.add = !draft.specificCourses.add
        }));
        break;
      }

      case 2: {
        this.setState(produce(draft => {
          draft.customQualifications.add = !draft.customQualifications.add
        }));
        break;
      }

      case 3: {
        this.setState(produce(draft => {
          draft.trainings.add = !draft.trainings.add
        }));
        break;
      }
    }
  };

  handleClickOutside = e => {
    // if (this.refs.numeric && !this.refs.numeric.contains(e.target)) {
    //   this.setState({focused: false})
    // } else {
    //   this.setState({focused: true})
    // }
    if (this.refs.add && !this.refs.add.contains(e.target)) {
      this.setState(produce(draft => {
        draft.specificCourses.add = false;
        draft.customQualifications.add = false;
        draft.trainings.add = false;
        draft.eligibilities.add = false;
      }))
    }
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
        <p>Qualification Standards</p>
      </div>;

    const specificCourses = this.state.specificCourses.data.map((course, i, a) => (
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
              {
                this.state.specificCourses.add ?
                  <div ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                    <input autoFocus type="text"/>
                  </div> :
                  <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                    <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <span onClick={() => this.onAdd(1)}>SPECIFIC COURSE</span></p>
                  </div>
              }
            </Col> :
            null
        }
      </Fragment>
    ));

    const customQualifications = this.state.customQualifications.data.map((custom, i, a) => (
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
              {
                this.state.customQualifications.add ?
                  <div ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                    <input autoFocus type="text"/>
                  </div> :
                  <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                    <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <span onClick={() => this.onAdd(2)}>CUSTOM QUALIFICATIONS</span></p>
                  </div>
              }
            </Col> :
            null
        }
      </Fragment>
    ));

    const trainings = this.state.trainings.data.map((training, i, a) => (
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
              {
                this.state.trainings.add ?
                  <div ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                    <input autoFocus type="text"/>
                  </div> :
                  <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                    <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <span onClick={() => this.onAdd(3)}>TRAINING</span></p>
                  </div>
              }
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
