import React, {Component, Fragment} from 'react';
import {Switch, Route, Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import connect from "react-redux/es/connect/connect";
import _ from 'lodash';

import Button from '../../../button/button';
import DatePicker from '../../../datePicker/datePicker';
import Select from '../../../select/select';

import {jobs, office, roles, employees, qualificationStandards} from "../../../../api";
import univStyles from "../../styles.scss";
import styles from "../office/office.scss";
import employeeStyles from './styles.scss';

import SearchBar from "../../searchBar/searchBar";
import Input from "../../../input/input";
import Numeric from "../../../numeric/numeric";
import TextArea from "../../../textarea/textArea";

import * as actions from "../../../../store/actions/ui/actions";
import { addToast } from "../../../../store/actions/ui/ui";

import {Scrollbars} from "react-custom-scrollbars";
import {CSSTransition} from "react-transition-group";
import Checkbox from "../../../checkBox/checkBox";

import { initializeSocket, events } from "../../../../socket";
import produce from "immer";
import moment from "moment";

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

    personalDataSheet: {
      personalInformation: {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: ''
      },
      educationalBackground: {
        elementary: {
          nameOfSchool: null,
          basicEducationDegreeCourse: null,
          periodOfAttendance: {
            from: null,
            to: null
          },
          highestLevelUnitsEarned: '', //if not graduated. for example 'Third year'
          scholarshipAcademicHonorsReceived: ['']
        },
        secondary: {
          nameOfSchool: null,
          basicEducationDegreeCourse: null,
          periodOfAttendance: {
            from: null,
            to: null
          },
          highestLevelUnitsEarned: '', //if not graduated. for example 'Third year'
          scholarshipAcademicHonorsReceived: ['']
        },
        vocational: {
          nameOfSchool: null,
          basicEducationDegreeCourse: null,
          periodOfAttendance: {
            from: null,
            to: null
          },
          highestLevelUnitsEarned: '', //if not graduated. for example 'Third year'
          scholarshipAcademicHonorsReceived: ['']
        },
        college: {
          nameOfSchool: null,
          basicEducationDegreeCourse: null, //this is id. accountancy is 23
          periodOfAttendance: {
            from: null,
            to: null
          },
          highestLevelUnitsEarned: '', //if not graduated. for example 'Third year'
          scholarshipAcademicHonorsReceived: ['']
        },
        graduateStudies: {
          nameOfSchool: null,
          basicEducationDegreeCourse: null,
          periodOfAttendance: {
            from: null,
            to: null
          },
          highestLevelUnitsEarned: '', //if not graduated. for example 'Third year'
          scholarshipAcademicHonorsReceived: ['']
        },
      },
      civilServiceEligibility: [],
      workExperienceOutsideCoa: [{
        positionTitle: '',
        isAbleToAdd: false
      }],
      workExperienceWithinCoa: [{
        positionTitle: '',
        isAbleToAdd: false
      }],
      trainingsAttended: [{
        training: null,
        hours: null,
        date: null,
        dataSource: [],
        isAbleToAdd: false
      }],
    },

    //region apiData
    eligibilities: [],
    trainings: [],
    selectedTrainings: [],
    courses: [],
    //endregion
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

    let courses, eligibilities, trainings;

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

        return axios.get(qualificationStandards.courses);
      })
      .then(res => {
        courses = res.data.data;

        return axios.get(qualificationStandards.eligibilities)
      })
      .then(res => {
        eligibilities = res.data.data;

        return axios.get(qualificationStandards.trainings)
      })
      .then(res => {
        trainings = res.data.data;

        console.log(eligibilities);

        this.setState(produce(draft => {
          draft.courses = courses;
          draft.eligibilities = eligibilities;
          draft.trainings = trainings;
        }));
      })
      .catch(err => {
        console.log(err)
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

  //region personalInformation
  onChangeDateOfBirth = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.personalInformation.dateOfBirth = o;
    }))
  };
  //endregion

  //region educationalBackground

  //region elementary
  onChangeElementaryScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.elementary.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddElementaryScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.elementary.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveElementaryScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.elementary.scholarshipAcademicHonorsReceived.pop()
    }))
  };

  onChangeElementaryNameOfSchool = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.elementary.nameOfSchool = value
    }));
  };

  onChangeElementaryFrom = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.elementary.periodOfAttendance.from = o
    }))
  };

  onChangeElementaryTo = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.elementary.periodOfAttendance.to = o
    }))
  };

  onChangeElementaryHighestLevel = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.elementary.highestLevelUnitsEarned = value;
    }))
  };
  //endregion

  //region secondary
  onChangeSecondaryScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.secondary.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddSecondaryScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.secondary.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveSecondaryScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.secondary.scholarshipAcademicHonorsReceived.pop()
    }))
  };

  onChangeSecondaryNameOfSchool = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.secondary.nameOfSchool = value
    }));
  };

  onChangeSecondaryFrom = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.secondary.periodOfAttendance.from = o
    }))
  };

  onChangeSecondaryTo = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.secondary.periodOfAttendance.to = o
    }))
  };

  onChangeSecondaryHighestLevel = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.secondary.highestLevelUnitsEarned = value;
    }))
  };
  //endregion

  //region vocational
  onChangeVocationalScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.vocational.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddVocationalScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.vocational.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveVocationalScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.vocational.scholarshipAcademicHonorsReceived.pop()
    }))
  };
  //endregion

  //region college
  onChangeCollegeCourse = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.basicEducationDegreeCourse = o;
    }))
  };

  onChangeCollegeScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddCollegeScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveCollegeScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.scholarshipAcademicHonorsReceived.pop()
    }))
  };

  onChangeCollegeNameOfSchool = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.nameOfSchool = value
    }));
  };

  onChangeCollegeFrom = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.periodOfAttendance.from = o
    }))
  };

  onChangeCollegeTo = o => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.periodOfAttendance.to = o
    }))
  };

  onChangeCollegeHighestLevel = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.college.highestLevelUnitsEarned = value;
    }))
  };
  //endregion

  //region graduateStudies
  onChangeGraduateStudiesScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddGraduateStudiesScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveGraduateStudiesScholarship = () => {
    this.setState(produce(draft => {
      draft.personalDataSheet.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived.pop()
    }))
  };
  //endregion

  //endregion

  //region eligibilities
  onChangeEligibility = o => {
    this.setState({civilServiceEligibility: o})
  };
  //endregion

  //region workExperienceOutsideCoa
  onChangeWorkExperienceOutsideCoa = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.workExperienceOutsideCoa[i].positionTitle = value;
    }))
  };

  onChangeWorkExperienceOutsideCoaCompanyName = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.workExperienceOutsideCoa[i].companyName = value;
    }))
  };

  onChangeWorkExperienceOutsideCoaFrom = (o, i) => {

    this.setState(produce(draft => {
      draft.workExperienceOutsideCoa[i].from = o;
    }))
  };

  onChangeWorkExperienceOutsideCoaTo = (o, i) => {

    this.setState(produce(draft => {
      draft.workExperienceOutsideCoa[i].to = o;
    }))
  };

  onAddWorkExperienceOutsideCoa = () => {
    this.setState(produce(draft => {
      draft.workExperienceOutsideCoa.push({positionTitle: ''});
    }))
  };

  onRemoveWorkExperienceOutsideCoa = () => {
    this.setState(produce(draft => {
      draft.workExperienceOutsideCoa.pop()
    }))
  };
  //endregion

  //region workExperienceWithinCoa
  onChangeWorkExperienceWithinCoa = (e, i) => {
    if(i === 0)
      return;

    const value = e.target.value;

    this.setState(produce(draft => {
      draft.workExperienceWithinCoa[i].positionTitle = value;
    }))
  };

  onChangeWorkExperienceWithinCoaOfficeName = (e, i) => {
    if(i === 0)
      return;

    const value = e.target.value;

    this.setState(produce(draft => {
      draft.workExperienceWithinCoa[i].officeName = value;
    }))
  };

  onChangeWorkExperienceWithinCoaFrom = (o, i) => {
    this.setState(produce(draft => {
      draft.workExperienceWithinCoa[i].from = o;
    }))
  };

  onChangeWorkExperienceWithinCoaTo = (o, i) => {
    this.setState(produce(draft => {
      draft.workExperienceWithinCoa[i].to = o;
    }))
  };

  onAddWorkExperienceWithinCoa = () => {
    this.setState(produce(draft => {
      draft.workExperienceWithinCoa.push({positionTitle: ''});
    }))
  };

  onRemoveWorkExperienceWithinCoa = () => {
    this.setState(produce(draft => {
      draft.workExperienceWithinCoa.pop()
    }))
  };
  //endregion

  //region trainingsAttended
  onChangeTrainingsAttended = (o, i) => {
    let selectedTrainingsBackup;

    //check if the selected training is equal from previous
    const isEqualFromPrevious = _.isEqual(this.state.trainingsAttended[i].training, o);

    if(isEqualFromPrevious) return;

    this.setState(produce(draft => {
      draft.trainingsAttended[i].training = o;

      //if user removes the selected training
      if(o == null) {
        //remove the previously selected option from selectedTrainings
        draft.selectedTrainings = _.differenceWith(this.state.selectedTrainings, [this.state.trainingsAttended[i].training], _.isEqual);
      } else {
        draft.selectedTrainings.push(o);

        if(this.state.trainingsAttended[i].training != null) {
          // draft.selectedTrainings = this.state.selectedTrainings.filter(training => {
          //   console.log(training, this.state.trainingsAttended[i].training);
          //   return training.value != this.state.trainingsAttended[i].training.value
          // })

          selectedTrainingsBackup = this.state.trainingsAttended[i].training
        }
      }
    }), () => this.filterTrainings(selectedTrainingsBackup));
  };

  onChangeTrainingsAttendedHours = (o, i) => {
    this.setState(produce(draft => {
      draft.trainingsAttended[i].hours = o
    }))
  };

  onChangeTrainingAttendedDate = (o, i) => {
    this.setState(produce(draft => {
      draft.trainingsAttended[i].date = o
    }))
  };

  onAddTrainingsAttended = () => {
    this.setState(produce(draft => {
      const filteredOptions = _.differenceWith(this.state.trainings, this.state.selectedTrainings, _.isEqual);

      draft.trainingsAttended.push({
        training: null,
        hours: null,
        date: null,
        dataSource: filteredOptions
      });
    }))
  };

  onRemoveTrainingsAttended = () => {
    this.setState(produce(draft => {
      draft.trainingsAttended.pop();

      if(this.state.trainingsAttended[this.state.trainingsAttended.length - 1].training != null) {
        draft.selectedTrainings = draft.selectedTrainings.filter(selectedTraining => {
          return selectedTraining.value !== this.state.trainingsAttended[this.state.trainingsAttended.length - 1].training.value
        })
      }
    }), this.filterTrainings)
  };

  filterTrainings = o => {
    let selectedTrainings = _.cloneDeep(this.state.selectedTrainings);

    if(o != null) {
      console.log(o.label);
      selectedTrainings = selectedTrainings.filter(selectedTraining => {
        return selectedTraining.value !== o.value
      });
    }

    this.setState(produce(draft => {
      this.state.trainingsAttended.forEach((trainingAttended, index) => {
        let filteredDataSource = _.differenceWith(this.state.trainings, selectedTrainings, _.isEqual);

        if(!!this.state.trainingsAttended[index].training) {
          filteredDataSource.push(this.state.trainingsAttended[index].training);
          filteredDataSource = _.orderBy(filteredDataSource, ['label'], ['asc']);
        }

        draft.trainingsAttended[index].dataSource = filteredDataSource;
        draft.selectedTrainings = selectedTrainings;
      })
    }));
  };
  //endregion

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

  //<div style={{padding: 15}}>
  //                       <div className={univStyles.groupOfFields}>
  //                         <p className={univStyles.title}>Primary details</p>
  //                         <div style={{display: 'flex'}}>
  //                           <div style={{flexGrow: 1, flexBasis: 0, marginRight: 15}}>
  //                             <div className={univStyles.input}>
  //                               <Input
  //                                 characterLimit={7}
  //                                 autofocus
  //                                 type="text"
  //                                 value={this.state.employeeId}
  //                                 onChangeHandler={this.onChangeEmployeeIdHandler}
  //                                 name="* Employee ID"/>
  //                             </div>
  //                             <div className={univStyles.input}>
  //                               <Select
  //                                 value={this.state.selectedOffice}
  //                                 isClearable
  //                                 onChangeHandler={o => this.onChangeOfficeHandler(o)}
  //                                 options={this.state.office}
  //                                 placeholder="* Office"/>
  //                             </div>
  //                             <div className={univStyles.input}>
  //                               <Select
  //                                 value={this.state.selectedRole}
  //                                 isClearable
  //                                 onChangeHandler={this.onChangeRole}
  //                                 options={this.state.roles}
  //                                 placeholder="* Role"/>
  //                             </div>
  //                           </div>
  //                           <div style={{flexGrow: 1, flexBasis: 0}}>
  //                             <div className={univStyles.input}>
  //                               <Select
  //                                 isClearable
  //                                 value={this.state.selectedJob}
  //                                 onChangeHandler={this.onChangeJobHandler}
  //                                 isDisabled={this.state.jobs.length === 0}
  //                                 options={this.state.jobs}
  //                                 placeholder="* Job"/>
  //                             </div>
  //                             <div className={univStyles.input}>
  //                               <Select
  //                                 isClearable
  //                                 value={this.state.selectedCluster}
  //                                 onChangeHandler={this.onChangeClusterHandler}
  //                                 isDisabled={this.state.clusters.length === 0}
  //                                 options={this.state.clusters}
  //                                 placeholder="* Cluster"/>
  //                             </div>
  //                           </div>
  //                         </div>
  //                       </div>
  //                       <div className={univStyles.groupOfFields}>
  //                         <p className={univStyles.title}>Personal information</p>
  //                         <div style={{display: 'flex'}}>
  //                           <div style={{flexGrow: 1, flexBasis: 0, marginRight: 15}}>
  //                             <div className={univStyles.input}>
  //                               <Input
  //                                 characterLimit={50}
  //                                 type="text"
  //                                 value={this.state.firstName}
  //                                 onChangeHandler={this.onChangeFirstNameHandler}
  //                                 name="* First name"/>
  //                             </div>
  //                             <div className={univStyles.input}>
  //                               <Input
  //                                 characterLimit={50}
  //                                 type="text"
  //                                 value={this.state.middleName}
  //                                 onChangeHandler={this.onChangeMiddleNameHandler}
  //                                 name="Middle name"/>
  //                             </div>
  //                           </div>
  //                           <div style={{flexGrow: 1, flexBasis: 0}}>
  //                             <div className={univStyles.input}>
  //                               <Input
  //                                 characterLimit={50}
  //                                 type="text"
  //                                 value={this.state.lastName}
  //                                 onChangeHandler={this.onChangeLastNameHandler}
  //                                 name="* Last name"/>
  //                             </div>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     </div>

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
              <div className={univStyles.pageMainNew} style={{marginBottom: 200}}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Employee Details</p>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Primary details</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Input
                          width={400}
                          showLabel
                          characterLimit={7}
                          autofocus
                          type="text"
                          value={this.state.employeeId}
                          onChangeHandler={this.onChangeEmployeeIdHandler}
                          name="* Employee ID"/>
                        <div style={{width: 400}}>
                          <Select
                            showLabel
                            value={this.state.selectedOffice}
                            isClearable
                            onChangeHandler={o => this.onChangeOfficeHandler(o)}
                            options={this.state.office}
                            placeholder="* Office"/>
                        </div>
                        <div style={{width: 400}}>
                          <Select
                            showLabel
                            isClearable
                            value={this.state.selectedJob}
                            onChangeHandler={this.onChangeJobHandler}
                            isDisabled={this.state.jobs.length === 0}
                            options={this.state.jobs}
                            placeholder="* Job"/>
                        </div>
                        <div style={{width: 400}}>
                          <Select
                            showLabel
                            isClearable
                            value={this.state.selectedCluster}
                            onChangeHandler={this.onChangeClusterHandler}
                            isDisabled={this.state.clusters.length === 0}
                            options={this.state.clusters}
                            placeholder="* Cluster"/>
                        </div>
                        <div style={{width: 400}}>
                          <Select
                            showLabel
                            value={this.state.selectedRole}
                            isClearable
                            onChangeHandler={this.onChangeRole}
                            options={this.state.roles}
                            placeholder="* Role"/>
                        </div>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Personal details</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Input
                          showLabel
                          width={400}
                          name="First name"/>
                        <Input
                          showLabel
                          width={400}
                          name="Middle name"/>
                        <Input
                          showLabel
                          width={400}
                          name="Last name"/>
                        <DatePicker
                          placeholder="Date of birth"
                          showLabel
                          style={{width: 400}}/>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Educational background - Elementary</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Input
                          showLabel
                          onChangeHandler={this.onChangeElementaryNameOfSchool}
                          value={this.state.personalDataSheet.educationalBackground.elementary.nameOfSchool}
                          name="* Name of school (Write in full)"/>
                        <div className={employeeStyles.row}>
                          <DatePicker
                            onChange={this.onChangeElementaryFrom}
                            selected={this.state.personalDataSheet.educationalBackground.elementary.periodOfAttendance.from}
                            placeholder="From"
                            showLabel/>
                          <DatePicker
                            onChange={this.onChangeElementaryTo}
                            selected={this.state.personalDataSheet.educationalBackground.elementary.periodOfAttendance.to}
                            placeholder="To"
                            showLabel/>
                        </div>
                        <Input
                          showLabel
                          name="Highest level / Units earned (If not graduated)"/>
                        <Input
                          showLabel
                          name="Scholarship / Academic honors received"/>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Educational background - Secondary</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Input
                          onChangeHandler={this.onChangeSecondaryNameOfSchool}
                          showLabel
                          name="* Name of school (Write in full)"/>
                        <div className={employeeStyles.row}>
                          <DatePicker

                            placeholder="From"
                            showLabel/>
                          <DatePicker

                            placeholder="To"
                            showLabel/>
                        </div>
                        <Input
                          showLabel
                          name="Highest level / Units earned (If not graduated)"/>
                        <Input
                          showLabel
                          name="Scholarship / Academic honors received"/>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Educational background - Vocational / Trade course</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Input
                          showLabel
                          name="* Name of school (Write in full)"/>
                        <div className={employeeStyles.row}>
                          <DatePicker
                            placeholder="From"
                            showLabel/>
                          <DatePicker
                            placeholder="To"
                            showLabel/>
                        </div>
                        <Input
                          showLabel
                          name="Highest level / Units earned (If not graduated)"/>
                        <Input
                          showLabel
                          name="Scholarship / Academic honors received"/>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Educational background - College</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Input
                          showLabel
                          name="* Name of school (Write in full)"/>
                        <div className={employeeStyles.row}>
                          <DatePicker
                            placeholder="From"
                            showLabel/>
                          <DatePicker
                            placeholder="To"
                            showLabel/>
                        </div>
                        <Input
                          showLabel
                          name="Highest level / Units earned (If not graduated)"/>
                        <Input
                          showLabel
                          name="Scholarship / Academic honors received"/>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Educational background - Graduate studies</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Input
                          showLabel
                          name="* Name of school (Write in full)"/>
                        <div className={employeeStyles.row}>
                          <DatePicker
                            placeholder="From"
                            showLabel/>
                          <DatePicker
                            placeholder="To"
                            showLabel/>
                        </div>
                        <Input
                          showLabel
                          name="Highest level / Units earned (If not graduated)"/>
                        <Input
                          showLabel
                          name="Scholarship / Academic honors received"/>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Civil Service Eligibility</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        <Select
                          isClearable
                          showLabel
                          isMulti
                          onChangeHandler={this.onChangeEligibility}
                          value={this.state.civilServiceEligibility}
                          placeholder="Eligibility"
                          options={this.state.eligibilities}/>
                      </div>
                    </div>
                    <div className={employeeStyles.row}>
                      <div className={employeeStyles.rowTitleContainer}>
                        <p>Work experience - Outside Commission on Audit</p>
                      </div>
                      <div className={employeeStyles.fieldsContainer}>
                        {
                          this.state.personalDataSheet.workExperienceOutsideCoa.map((e, i, a) => {
                            return (
                              <Fragment key={i}>
                                  <Input
                                    showLabel
                                    onChangeHandler={e => this.onChangeWorkExperienceOutsideCoa(e, i)}
                                    value={this.state.personalDataSheet.workExperienceOutsideCoa[i].positionTitle}
                                    name="Position title"/>
                                  <Input
                                    showLabel
                                    onChangeHandler={e => this.onChangeWorkExperienceOutsideCoaCompanyName(e, i)}
                                    value={this.state.personalDataSheet.workExperienceOutsideCoa[i].companyName}
                                    name="Company name"/>
                                  <DatePicker
                                    showLabel
                                    openToDate={i > 0 ? this.state.personalDataSheet.workExperienceOutsideCoa[i-1].to : null}
                                    minDate={i > 0 ? moment(this.state.personalDataSheet.workExperienceOutsideCoa[i-1].to) : null}
                                    selected={this.state.personalDataSheet.workExperienceOutsideCoa[i].from}
                                    onChange={o => this.onChangeWorkExperienceOutsideCoaFrom(o, i)}
                                    value={this.state.personalDataSheet.workExperienceOutsideCoa[i].from}
                                    showYearDropdown
                                    placeholder="From"/>
                                  <DatePicker
                                    showLabel
                                    openToDate={this.state.personalDataSheet.workExperienceOutsideCoa[i].from}
                                    selected={this.state.personalDataSheet.workExperienceOutsideCoa[i].to}
                                    onChange={o => this.onChangeWorkExperienceOutsideCoaTo(o, i)}
                                    value={this.state.personalDataSheet.workExperienceOutsideCoa[i].to}
                                    showYearDropdown
                                    placeholder="To"/>
                                {
                                  a.length > 1 && i < a.length - 1 ?
                                    <div className={styles.hr}/> :
                                    null
                                }
                              </Fragment>
                            )
                          })
                        }
                        {
                          this.state.personalDataSheet.workExperienceOutsideCoa[0].positionTitle.length > 0 ?
                            <p style={{margin: 0, marginTop: 5}}>
                              {
                                this.state.personalDataSheet.workExperienceOutsideCoa.length > 1 ?
                                  <Fragment>
                                    <span onClick={this.onRemoveWorkExperienceOutsideCoa} className={styles.remove}>REMOVE</span>
                                    &nbsp;&nbsp;or&nbsp;&nbsp;
                                  </Fragment> :
                                  null
                              }
                              <span onClick={this.onAddWorkExperienceOutsideCoa} className={styles.addMore}>ADD MORE</span>
                            </p> :
                            null
                        }
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
