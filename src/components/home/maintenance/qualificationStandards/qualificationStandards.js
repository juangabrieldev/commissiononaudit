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
      new: null,
      data: [],
      add: false
    },
    customQualifications: {
      new: null,
      data: [],
      add: false
    },
    trainings: {
      new: null,
      data: [],
      add: false
    },
    eligibility: {
      new: null,
      data: [],
      add: false
    }
  };

  componentDidMount = () => {
    this.mounted = true;

    this.fetch();
    document.addEventListener('mousedown', this.handleClickOutside);

    const socket = initializeSocket();

    socket.on(events.qualificationStandards, this.fetch);
  };

  componentDidUpdate = () => {
    // this.blockNavigationChecker();
  };

  componentWillUnmount = () => {
    this.mounted = false;

    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  fetch = () => {
    axios.get(qualificationStandards.get)
      .then(res => {
        if(res.data.status === 200 && this.mounted) {
          this.setState(produce(draft => {
            draft.specificCourses.data = res.data.data.educationSpecific;
            draft.customQualifications.data = res.data.data.educationCustom;
            draft.trainings.data = res.data.data.trainings;
            draft.eligibility.data = res.data.data.eligibility;
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

      case 4: {
        this.setState(produce(draft => {
          draft.eligibility.add = !draft.eligibility.add
        }));
        break;
      }
    }
  };

  handleClickOutside = e => {
    if (this.refs.add && !this.refs.add.contains(e.target)) {
      this.setState(produce(draft => {
        draft.specificCourses.add = false;
        draft.customQualifications.add = false;
        draft.trainings.add = false;
        draft.eligibility.add = false;
      }))
    }
  };

  blockNavigationChecker = () => {
    console.log(this.state.trainings.new);
    if(this.state.trainings.new) {
      if (!this.props.blockedNavigation) {
        this.props.blockNavigation(true, `You aren't finished yet. Are you sure you want to leave?`);
      }
    } else {
      this.props.blockNavigation(false);
    }
  };

  addCancel = () => {
    this.setState(produce(draft => {
      draft.specificCourses.add = false;
      draft.specificCourses.new = null;
      draft.customQualifications.add = false;
      draft.customQualifications.new = null;
      draft.trainings.add = false;
      draft.trainings.new = null;
      draft.eligibility.add = false;
      draft.eligibility.new = null;
    }))
  };

  onEnter = (e, s) => {
    const value = e.target.value;

    if(e.which === 13) {
      switch(s) {
        case 1: {
          axios.post(qualificationStandards.create, {
            type: s,
            value
          })
            .then(res => {
              if(res.data.status === 200) {
                this.addCancel()
              }
            });
          break;
        }

        case 2: {
          axios.post(qualificationStandards.create, {
            type: s,
            value
          })
            .then(res => {
              if(res.data.status === 200) {
                this.addCancel()
              }
            });
          break;
        }

        case 3: {
          axios.post(qualificationStandards.create, {
            type: s,
            value
          })
            .then(res => {
              if(res.data.status === 200) {
                this.addCancel()
              }
            });
          break;
        }

        case 4: {
          axios.post(qualificationStandards.create, {
            type: s,
            value
          })
            .then(res => {
              if(res.data.status === 200) {
                this.addCancel()
              }
            });
          break;
        }
      }
    }
  };

  onChangeHandler = (e, s) => {
    const value = e.target.value;

    if(value.length > 40) return;

    switch(s) {
      case 1: {
        this.setState(produce(draft => {
          draft.specificCourses.new = value
        }));
        break;
      }

      case 2: {
        this.setState(produce(draft => {
          draft.customQualifications.new = value
        }));
        break;
      }

      case 3: {
        this.setState(produce(draft => {
          draft.trainings.new = value
        }));
        break;
      }

      case 4: {
        this.setState(produce(draft => {
          draft.eligibility.new = value
        }));
        break;
      }
    }
  };

  onDelete = (id, s) => {
    switch(s) {
      case 1: {
        axios.post(qualificationStandards.delete, {
          type: s,
          id
        })
          .then(res => {
            if(res.data.status === 200) {
              this.addCancel()
            }
          });
        break;
      }

      case 2: {
        axios.post(qualificationStandards.delete, {
          type: s,
          id
        })
          .then(res => {
            if(res.data.status === 200) {
              this.addCancel()
            }
          });
        break;
      }

      case 3: {
        axios.post(qualificationStandards.delete, {
          type: s,
          id
        })
          .then(res => {
            if(res.data.status === 200) {
              this.addCancel()
            }
          });
        break;
      }

      case 4: {
        axios.post(qualificationStandards.delete, {
          type: s,
          id
        })
          .then(res => {
            if(res.data.status === 200) {
              this.addCancel()
            }
          });
        break;
      }
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
              <p><span onClick={() => this.onDelete(course.id)}>EDIT</span> or <span onClick={() => this.onDelete(course.id, 1)}>DELETE</span></p>
            </div>
          </div>
        </Col>
        {
          i === a.length - 1 ?
            <Col xs={4}>
              {
                this.state.specificCourses.add ?
                  <div onKeyPress={e => this.onEnter(e, 1)} ref="tangina" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                    <input onChange={e => console.log(e)} value={this.state.specificCourses.new} autoFocus type="text"/>
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
              <p><span onClick={() => this.onDelete(custom.id)}>EDIT</span> or <span onClick={() => this.onDelete(custom.id, 2)}>DELETE</span></p>
            </div>
          </div>
        </Col>
        {
          i === a.length - 1 ?
            <Col xs={4}>
              {
                this.state.customQualifications.add ?
                  <div onKeyPress={e => this.onEnter(e, 2)} ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                    <input onChange={e => this.onChangeHandler(e, 2)} value={this.state.customQualifications.new} autoFocus type="text"/>
                  </div> :
                  <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                    <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <span onClick={() => this.onAdd(2)}>CUSTOM QUALIFICATION</span></p>
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
              <p><span onClick={() => this.onDelete(training.id)}>EDIT</span> or <span onClick={() => this.onDelete(training.id, 3)}>DELETE</span></p>
            </div>
          </div>
        </Col>
        {
          i === a.length - 1 ?
            <Col xs={4}>
              {
                this.state.trainings.add ?
                  <div onKeyPress={e => this.onEnter(e, 3)} ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                    <input onChange={e => this.onChangeHandler(e, 3)} value={this.state.trainings.new} autoFocus type="text"/>
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

    const eligibility = this.state.eligibility.data.map((e, i, a) => {
      return (
        <Fragment key={e.key}>
          <Col xs={4}>
            <div style={{marginTop: 15}} className={univStyles.fields}>
              <p className={univStyles.onlyContent}>{e.name}</p>
              <div className={univStyles.edit}>
                <p><span onClick={() => this.onDelete(e.id)}>EDIT</span> or <span onClick={() => this.onDelete(e.id, 4)}>DELETE</span></p>
              </div>
            </div>
          </Col>
          {
            i === a.length - 1 ?
              <Col xs={4}>
                {
                  this.state.eligibility.add ?
                    <div onKeyPress={e => this.onEnter(e, 4)} ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                      <input onChange={e => this.onChangeHandler(e, 4)} value={this.state.eligibilities.new} autoFocus type="text"/>
                    </div> :
                    <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                      <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD AN <span onClick={() => this.onAdd(4)}>ELIGIBILITY</span></p>
                    </div>
                }
              </Col> :
              null
          }
        </Fragment>
      )
    });

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
                    <p
                      className={univStyles.subtitle}>
                      {
                        this.state.specificCourses.data.length +
                        this.state.customQualifications.data.length +
                        this.state.trainings.data.length +
                        this.state.eligibility.data.length
                      } records
                    </p>
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
                              {
                                customQualifications.length > 0 ?
                                  customQualifications :
                                  <Col xs={4}>
                                    {
                                      this.state.customQualifications.add ?
                                        <div onKeyPress={e => this.onEnter(e, 2)} ref={node => console.log(node)} style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                                          <input onChange={e => this.onChangeHandler(e, 2)} value={this.state.customQualifications.new} autoFocus type="text"/>
                                        </div> :
                                        <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                                          <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <span onClick={() => this.onAdd(2)}>CUSTOM QUALIFICATIONS</span></p>
                                        </div>
                                    }
                                  </Col>
                              }
                            </Row>
                          </Container>
                      </div>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Trainings</p>
                        <Container fluid style={{padding: 0, marginTop: -12}}>
                          <Row>
                            {
                              trainings.length > 0 ?
                                trainings :
                                <Col xs={4}>
                                  {
                                    this.state.trainings.add ?
                                      <div onKeyPress={e => this.onEnter(e, 3)} ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                                        <input onChange={e => this.onChangeHandler(e, 3)} value={this.state.trainings.new} autoFocus type="text"/>
                                      </div> :
                                      <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                                        <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD A <span onClick={() => this.onAdd(3)}>TRAINING</span></p>
                                      </div>
                                  }
                                </Col>
                            }
                          </Row>
                        </Container>
                      </div>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Eligibilities</p>
                        <Container fluid style={{padding: 0, marginTop: -12}}>
                          <Row>
                            {
                              eligibility.length > 0 ?
                                eligibility :
                                <Col xs={4}>
                                  {
                                    this.state.eligibility.add ?
                                      <div onKeyPress={e => this.onEnter(e, 4)} ref="add" style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add + ' ' + univStyles.addActive}>
                                        <input onChange={e => this.onChangeHandler(e, 4)} value={this.state.eligibilities.new} autoFocus type="text"/>
                                      </div> :
                                      <div style={{marginTop: 15}} className={univStyles.fields + ' ' + univStyles.add}>
                                        <p style={{textAlign: 'center'}}>+&nbsp;&nbsp;ADD AN <span onClick={() => this.onAdd(4)}>ELIGIBILITY</span></p>
                                      </div>
                                  }
                                </Col>
                            }
                          </Row>
                        </Container>
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
