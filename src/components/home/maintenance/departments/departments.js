import React, {Component} from 'react';
import { Switch, Route, Link, Prompt, withRouter  } from 'react-router-dom';
import ReactSVG from 'react-svg';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import Slug from 'slugify';
import produce from 'immer';
import axios from 'axios';
import moment from 'moment';
import Parser from 'html-react-parser';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import styles from './departments.scss';
import univStyles from '../../styles.scss';

import Button from '../../../button/button';
import Checkbox from '../../../checkBox/checkBox';
import Input from '../../../input/input';
import SearchBar from '../../searchBar/searchBar';
import TextArea from '../../../textarea/textArea';

import departmentsWidget from '../../../../assets/ui/departments.svg';
import leaf from '../../../../assets/ui/leaf.svg';

import * as actions from '../../../../store/actions/ui/actions';

import { departments } from "../../../../api";

import { initializeSocket, events } from "../../../../socket";
import ViewDepartment from "./viewDepartment";

class Jobs extends Component {
  state = {
    departmentName: '',
    departmentDescription: '',
    blockedNavigation: false,
    departments: [],
    selectedDepartments: [],
    previousLink: '',
    departmentViewed: false,
    slug: '',
    showTransition: false
  };

  fetch = () => {
    axios.get(departments.get)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({departments: [...res.data.data], selectedDepartments: [], previousLink: '/maintenance/departments'}, () => this.setState({showTransition: true}))
        }
      });
  };

  componentDidUpdate = prev => {
    if(prev.location.pathname !== this.props.location.pathname) {
      this.setState({
        departmentName: '',
        departmentDescription: ''
      });
    }
  };

  componentDidMount = () => {
    this.fetch();

    const socket = initializeSocket();

    socket.on(events.departments, () => {
      setTimeout(() => this.fetch(), 50) //compensation
    })
  };

  onChangeDepartmentName = e => {
    const departmentName = {...e};

    this.setState({departmentName: departmentName.target.value}, () => {
      if(departmentName.target.value.length > 0) {
        if(!this.props.blockedNavigation) {
          this.props.blockNavigation(true, `You haven't finished your post yet. Are you sure you want to leave?`);
        }
      } else {
        this.props.blockNavigation(false);
      }
    })
  };

  onChangeDescription = e => {
    this.setState({departmentDescription: e.target.value})
  };

  onCancel = () => {
    this.props.blockNavigation(false);
    setTimeout(() => {
      this.props.history.push(this.state.previousLink);
      this.setState({departmentName: ''})
    }, 0);
  };

  onSelect = (id, value) => {
    if(value) {
      this.setState(produce(draft => {
        draft.selectedDepartments.push(id)
      }))
    } else {
      const index = this.state.selectedDepartments.indexOf(id);

      this.setState(produce(draft => {
        draft.selectedDepartments.splice(index, 1)
      }))
    }
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/maintenance/departments/new')
  };

  onSave = () => {
    axios.post(departments.create, {
      departmentName: this.state.departmentName,
      departmentDescription: this.state.departmentDescription,
      slug: Slug(this.state.departmentName.toLowerCase()),
      employeeId: this.props.employeeId,
      firstName: this.props.firstName
    })
      .then(res => {
        if(res.data.status === 200) {
          this.props.blockNavigation(false);
          axios.get(departments.get)
            .then(res => {
              if(res.data.status === 200) {
                this.props.history.push('/maintenance/departments/');
              }
            });
        }
      })
  };

  onDelete = () => {
    axios.post(departments.delete, {
      id: [...this.state.selectedDepartments],
      employeeId: this.props.employeeId,
      firstName: this.props.firstName
    })
      .then(res => {
        console.log(res.data);
        if(res.data.status === 200) {
          this.setState({selectedDepartments: []});
        }
      })
  };

  render() {
    let newDepartments = 0;

    const departmentsTitleBar =
      <div className={univStyles.titleBar + (this.props.location.pathname.includes('/new') ? ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Create new department</p>
              <a onClick={this.onCancel}>Cancel</a>
              <Button onClick={this.onSave} width={70} classNames={['tertiary']} name="SAVE"/>
            </React.Fragment> :
            <React.Fragment>
              <p>Departments</p>
              <Button onClick={this.onCreate} classNames={['primary']} name="+  CREATE NEW DEPARTMENT"/>
            </React.Fragment>
        }
      </div>;

    const departmentRows = this.state.departments.map(department => {
      const selected = this.state.selectedDepartments.find(element => {
        return element === department.id;
      });

      if(department.newDepartment) {
        newDepartments++;
      }

      return (
        <CSSTransition
          key={department.key}
          timeout={4000}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
          }}>
          <div className={styles.row + (selected ? ' ' + styles.selected : '')}>
            <div className={styles.select}>
              <Checkbox toggle={value => this.onSelect(department.id, value)} />
            </div>
            <div className={styles.departmentNameRow}>
              <Link to={'/maintenance/departments/' + department.slug}>{department.departmentName}</Link>
              {
                department.newDepartment ?
                  <span>NEW</span> :
                  null
              }
            </div>
            <div className={styles.departmentHeadRow}>
              <p>{department.departmentHead}</p>
            </div>
            <div className={styles.dateAddedRow}>
              <p title={'Created on ' + moment(department.dateCreated).format('dddd, MMMM D, YYYY') + ' at ' + moment(department.dateCreated).format('h:mm A')}>{moment(department.dateCreated).format('MMMM D, YYYY')}</p>
            </div>
            <div className={styles.numberOfEmployeesRow}>
              <p>46</p>
              <div className={styles.options}>
                <div/>
                <div/>
                <div/>
              </div>
            </div>
          </div>
        </CSSTransition>
      )
    }
    );

    return (
      <React.Fragment>
        {departmentsTitleBar}
        <Switch>
          <Route path={'/maintenance/departments'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={styles.summary}>
                  <div className={styles.tab}>
                    <div className={styles.icon} style={{backgroundColor: '#93cc46'}}>
                      <ReactSVG path={departmentsWidget} svgStyle={{fill: 'white', height: 30}}/>
                    </div>
                    <div className={styles.meta}>
                      <div className={styles.inside}>
                        <p className={styles.number}>{this.state.departments.length}</p>
                        <p className={styles.sub}>Total departments</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tab}>
                    <div className={styles.icon} style={{backgroundColor: '#4688ff'}}>
                      <ReactSVG path={leaf} svgStyle={{fill: 'white', height: 30}}/>
                    </div>
                    <div className={styles.meta}>
                      <div className={styles.inside}>
                        <p className={styles.number}>{newDepartments}</p>
                        <p className={styles.sub}>Newly created departments</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>List of Departments</p>
                    {
                      this.state.selectedDepartments.length !== 0 ?
                        <p onClick={this.onDelete} className={univStyles.formControl + ' ' + univStyles.delete}>Delete</p> :
                        null
                    }
                    <SearchBar
                      placeholder="Search Departments"
                      style={{
                        width: 170,
                        marginRight: 12,
                        marginLeft: this.state.selectedDepartments.length === 0 ? 'auto' : ''
                      }}/>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={styles.rowHeader}>
                      <div className={styles.departmentName}>
                        <p>Department Name</p>
                      </div>
                      <div className={styles.departmentHead}>
                        <p>Department Head</p>
                      </div>
                      <div className={styles.dateAdded}>
                        <p>Date added</p>
                      </div>
                      <div className={styles.numberOfEmployees}>
                        <p>Number of employees</p>
                      </div>
                    </div>
                    <div className={styles.tableBody}>
                      <Scrollbars
                        style={{
                          width: '100%',
                          maxHeight: 'calc(100vh - 300px)',
                        }}
                        autoHeight
                        autoHide>
                        <TransitionGroup exit={false} component={null} enter={this.state.showTransition}>
                          {departmentRows}
                        </TransitionGroup>
                        <p className={styles.end}>end of results</p>
                      </Scrollbars>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }/>
          <Route path={'/maintenance/departments/new'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Department Details</p>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={styles.newBody}>
                      <div className={styles.input}>
                        <Input
                          characterLimit={40}
                          autofocus
                          type="text"
                          value={this.state.departmentName}
                          onChangeHandler={e => this.onChangeDepartmentName(e)}
                          name="* Department Name"/>
                      </div>
                      <div className={styles.input}>
                        <TextArea characterLimit={300} value={this.state.departmentDescription} onChangeHandler={e => this.onChangeDescription(e)} name="Description"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
            </div>
          }/>
          <Route path={'/maintenance/departments/:slug'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <Route path={'/maintenance/departments/:slug'} exact component={ViewDepartment}/>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Jobs));
