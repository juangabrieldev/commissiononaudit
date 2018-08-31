import React, {Component, Fragment} from 'react';
import {Switch, Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import connect from "react-redux/es/connect/connect";

import Button from '../../../button/button';
import Select from '../../../select/select';

import {jobs, office, roles, employees} from "../../../../api";
import univStyles from "../../styles.scss";
import SearchBar from "../../searchBar/searchBar";
import Input from "../../../input/input";
import Numeric from "../../../numeric/numeric";
import TextArea from "../../../textarea/textArea";

import * as actions from "../../../../store/actions/ui/actions";

import { addToast } from "../../../../store/actions/ui/ui";
import styles from "../office/office.scss";
import {Scrollbars} from "react-custom-scrollbars";
import {CSSTransition} from "react-transition-group";
import Checkbox from "../../../checkBox/checkBox";

import { initializeSocket, events } from "../../../../socket";

class Employees extends Component {
  state = {
    employees: [],
    selectedEmployee: [],
    office: [],
    employeeId: null,
    jobs: [],
    roles: [],
    clusters: [],
    selectedOffice: null,
    selectedJob: null,
    selectedCluster: null,
    selectedRole: null,
    previousLink: '/maintenance/employees',
    firstName: null,
    middleName: null,
    lastName: null
  };

  componentDidMount = () => {
    this.mounted = true;

    this.fetch();

    const socket = initializeSocket();

    socket.on(events.employees, this.fetch)
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };


  fetch = () => {
    let data = {
      office: null,
      roles: null,
      employees: null
    };

    axios.get(office.get + '?jobs=1') //for react-select
      .then(res => {
        data.office = res.data.data;
        return axios.get(roles.select);
        //   axios.get(roles.select)
        //     .then(res => {
        //       this.setState({roles: res.data.data}, () => {
        //         axios.get(employees.get) // for actual employees data
        //           .then(res => {
        //             this.setState({employees: res.data.data})
        //           })
        //       })
        //     })
        // })
      })
      .then(res => {
        data.roles = res.data.data;
        return axios.get(employees.get);
      })
      .then(res => {
        data.employees = res.data.data;

        if(this.mounted) {
          this.setState({
            office: data.office,
            roles: data.roles,
            employees: data.employees
          })
        }
      })
  };

  onChangeOfficeHandler =  o => {
    this.setState({selectedOffice: o}, () => {
      axios.post(jobs.view + '/select', {
        selectedOffice: this.state.selectedOffice
      })
        .then(res => {
          if(res.data.status === 200) {
            this.setState({jobs: res.data.data, selectedJob: null}, () => {
              if(!!this.state.selectedOffice) {
                axios.get(office.clusters + `/${this.state.selectedOffice.value}`)
                  .then(res => {
                    this.setState({clusters: res.data.data})
                  })
              }
            })
          }
        })
    })
  };

  onChangeJobHandler = o => {
    this.setState({selectedJob: o}, () => {
    })
  };

  onChangeClusterHandler = o => {
    this.setState({selectedCluster: o})
  };

  onChangeEmployeeIdHandler = e => {
    const value = e.target.value;

    // if(value.length > 7) return;

    this.setState({
      employeeId: value
    })
  };

  onChangeRole = o => {
    this.setState({selectedRole: o})
  };

  onChangeFirstNameHandler = e => {
    this.setState({firstName: e.target.value})
  };

  onChangeMiddleNameHandler = e => {
    this.setState({middleName: e.target.value})
  };

  onChangeLastNameHandler = e => {
    this.setState({lastName: e.target.value})
  };

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState !== this.state) {
      this.blockNavigationChecker();
    }
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/maintenance/employees/new')
  };

  onCancel = () => {
    this.props.blockNavigation(false);
    setTimeout(() => {
      this.props.history.push(this.state.previousLink);
      this.setState({officeName: ''})
    }, 0);
  };


  blockNavigationChecker = () => {
    // if (!!this.state.jobName || !!this.state.jobDescription || !!this.state.selectedEducation || !!this.state.selectedEligibility) {
    //   if (!this.props.blockedNavigation) {
    //     this.props.blockNavigation(true, `You haven't finished your post yet. Are you sure you want to leave?`);
    //   }
    // } else {
    //   this.props.blockNavigation(false);
    // }
  };

  reset = () => {
    this.setState({
      employeeId: null,
      jobId: null,
      firstName: null,
      middleName: null,
      lastName: null,
      clusterId: null,
      role: null,
      office: null,
    })
  };

  onSave = () => {
    axios.post(employees.create, {
      employeeId: this.state.employeeId,
      jobId: this.state.selectedJob.value,
      firstName: this.state.firstName,
      middleName: this.state.middleName,
      lastName: this.state.lastName,
      clusterId: this.state.selectedCluster.value,
      role: this.state.selectedRole.value,
      office: this.state.selectedOffice.value
    })
      .then(res => {
        if(res.data.status === 200) {
          this.props.history.push('/maintenance/employees');
          this.props.addToast(`Sucessfully added ${this.state.firstName} ${this.state.lastName} to employees.`);
          this.reset();
        }
      })
  };

  render() {
    const employeesTitleBar =
      <div className={univStyles.titleBar + (this.props.location.pathname.includes('/new') ? ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Create new employee</p>
              <a onClick={this.onCancel}>Cancel</a>
              <Button disabled={this.state.saveDisabled} onClick={this.onSave} width={70} classNames={['tertiary']} name="SAVE"/>
            </React.Fragment> :
            <React.Fragment>
              <p>Employees</p>
              <Button onClick={this.onCreate} classNames={['primary']} name="+  CREATE NEW EMPLOYEE"/>
            </React.Fragment>
        }
      </div>;

    const employeeRows = this.state.employees.map(employee => {
      const selected = this.state.selectedEmployee.find(element => {
        return element === employee.id;
      });

      const registrationStatus = () => {
        if(parseInt(employee.registered, 10) === 1 && employee.registrationcomplete) {
          return 'Completely registered'
        } else if(parseInt(employee.registered, 10) === 1) {
          return 'Registered, but not complete'
        } else {
          return 'Not yet registered'
        }
      };

      return (
        <CSSTransition
          key={employee.key}
          timeout={4000}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
          }}>
          <div className={styles.row + (selected ? ' ' + styles.selected : '')}>
            <div className={styles.select}>
              <Checkbox toggle={value => this.onSelect(employee.id, value)} />
            </div>
            <div className={styles.employeeNameRow}>
              <Link to={'/maintenance/employees/' + employee.slug}>
                {
                  employee.firstname + ' ' +  (employee.middlename !== null ? employee.middlename.charAt(0) + '. ' : '') + employee.lastname
                }
                {
                  (this.props.employeeId === employee.employeeid ? <Fragment> <span>(YOU)</span></Fragment> : '')
                }
              </Link>
            </div>
            <div className={styles.filler}>
            </div>
            <div className={styles.registrationStatusRow}>
              <p>
                {
                  <Fragment>
                    {
                      registrationStatus()
                    }
                  </Fragment>

                }
              </p>
            </div>
            <div className={styles.verificationStatusRow}>
              <p>
                {
                  employee.verified ?
                    'Verified' :
                    'Not yet verified'
                }
              </p>
              <div className={styles.options}>
                <div/>
                <div/>
                <div/>
              </div>
            </div>
          </div>
        </CSSTransition>
      )
    });

    return (
      <React.Fragment>
        {employeesTitleBar}
        <Switch>
          <Route path={'/maintenance/employees'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Employees</p>
                    <p className={univStyles.subtitle}>{this.state.employees.length} records</p>
                    <SearchBar
                      placeholder="Search Employees"
                      style={{
                        width: 170,
                        marginRight: 12,
                        marginLeft: 'auto'
                      }}/>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={styles.rowHeader}>
                      <div className={styles.employeeName}>
                        <p>Employee name</p>
                      </div>
                      <div className={styles.registrationStatus}>
                        <p>Registration status</p>
                      </div>
                      <div className={styles.verificationStatus}>
                        <p>Verification status</p>
                      </div>
                    </div>
                    <div className={styles.tableBody}>
                      <Scrollbars
                        style={{
                          width: '100%',
                          maxHeight: 'calc(100vh - 190px)',
                        }}
                        autoHeight
                        autoHide>
                        {employeeRows}
                        <p className={styles.end}>end of results</p>
                      </Scrollbars>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }/>
          <Route path={'/maintenance/employees/new'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Employee Details</p>
                  </div>
                  <div className={univStyles.formBody}>
                    <div style={{padding: 15}}>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Primary details</p>
                        <div className={univStyles.input}>
                          <Input
                            characterLimit={7}
                            autofocus
                            type="text"
                            value={this.state.employeeId}
                            onChangeHandler={this.onChangeEmployeeIdHandler}
                            name="* Employee ID"/>
                        </div>
                        <div className={univStyles.input}>
                          <Select
                            value={this.state.selectedOffice}
                            isClearable
                            onChangeHandler={o => this.onChangeOfficeHandler(o)}
                            options={this.state.office}
                            placeholder="* Office"/>
                        </div>
                        <div className={univStyles.input}>
                          <Select
                            isClearable
                            value={this.state.selectedJob}
                            onChangeHandler={this.onChangeJobHandler}
                            isDisabled={this.state.jobs.length === 0}
                            options={this.state.jobs}
                            placeholder="* Job"/>
                        </div>
                        <div className={univStyles.input}>
                          <Select
                            isClearable
                            value={this.state.selectedCluster}
                            onChangeHandler={this.onChangeClusterHandler}
                            isDisabled={this.state.clusters.length === 0}
                            options={this.state.clusters}
                            placeholder="* Cluster"/>
                        </div>
                        <div className={univStyles.input}>
                          <Select
                            value={this.state.selectedRole}
                            isClearable
                            onChangeHandler={this.onChangeRole}
                            options={this.state.roles}
                            placeholder="* Role"/>
                        </div>
                      </div>
                      <div className={univStyles.groupOfFields}>
                        <p className={univStyles.title}>Personal information</p>
                        <div className={univStyles.input}>
                          <Input
                            characterLimit={50}
                            type="text"
                            value={this.state.firstName}
                            onChangeHandler={this.onChangeFirstNameHandler}
                            name="* First name"/>
                        </div>
                        <div className={univStyles.input}>
                          <Input
                            characterLimit={50}
                            type="text"
                            value={this.state.middleName}
                            onChangeHandler={this.onChangeMiddleNameHandler}
                            name="Middle name"/>
                        </div>
                        <div className={univStyles.input}>
                          <Input
                            characterLimit={50}
                            type="text"
                            value={this.state.lastName}
                            onChangeHandler={this.onChangeLastNameHandler}
                            name="* Last name"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
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
      }),
    addToast: message => dispatch(addToast(message))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Employees));
