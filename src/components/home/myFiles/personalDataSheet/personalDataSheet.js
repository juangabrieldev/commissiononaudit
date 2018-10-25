import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import produce from 'immer';
import _ from 'lodash';
import moment from "moment";
import axios from "axios";
import ReactSVG from "react-svg";
import {Col, Container, Row} from "react-grid-system";

import univStyles from '../../styles.scss'
import styles from "../../applications/applications/styles.scss";
import jobIcon from "../../../../assets/ui/jobs.svg";
import employeeStyles from "../../maintenance/employees/styles.scss";
import Input from "../../../input/input";
import Select from "../../../select/select";
import DatePicker from "../../../datePicker/datePicker";

import {employees, office, qualificationStandards, roles} from "../../../../api";

class MyFiles extends Component {
  state = {
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
    this.fetch();
  };

  fetch = () => {
    let courses, eligibilities, trainings;

    axios.get(qualificationStandards.eligibilities)
      .then(res => {
        eligibilities = res.data.data;

        return axios.get(qualificationStandards.trainings)
      })
      .then(res => {
        trainings = res.data.data;

        return axios.get(employees.personalDataSheet + this.props.employeeId)
      })
      .then(res => {
        const { personalDataSheet } = res.data.data;

        this.setState(produce(draft => {
          draft.eligibilities = eligibilities;
          draft.trainings = trainings;
          draft.personalDataSheet = personalDataSheet
        }));
      })
  };

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
    this.setState(produce(draft => {
      draft.personalDataSheet.civilServiceEligibility = o;
    }))
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
    let selectedTrainings = _.cloneDeep(this.state.personalDataSheet.selectedTrainings);

    if(o != null) {
      console.log(o.label);
      selectedTrainings = selectedTrainings.filter(selectedTraining => {
        return selectedTraining.value !== o.value
      });
    }

    this.setState(produce(draft => {
      this.state.personalDataSheet.trainingsAttended.forEach((trainingAttended, index) => {
        let filteredDataSource = _.differenceWith(this.state.trainings, selectedTrainings, _.isEqual);

        if(!!this.state.personalDataSheet.trainingsAttended[index].training) {
          filteredDataSource.push(this.state.personalDataSheet.trainingsAttended[index].training);
          filteredDataSource = _.orderBy(filteredDataSource, ['label'], ['asc']);
        }

        draft.personalDataSheet.trainingsAttended[index].dataSource = filteredDataSource;
        draft.selectedTrainings = selectedTrainings;
      })
    }));
  };
  //endregion

  render() {
    const myFilesTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>
          My Personal Data Sheet
        </p>
      </div>;

    return (
      <Fragment>
        {myFilesTitleBar}
        <div className={univStyles.main}>
          <div className={univStyles.pageMainNew} style={{marginBottom: 200}}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>View or update my PDS</p>
              </div>
              <div className={univStyles.formBody}>
                {/*<div className={employeeStyles.row}>*/}
                  {/*<div className={employeeStyles.rowTitleContainer}>*/}
                    {/*<p>Educational background - Secondary</p>*/}
                  {/*</div>*/}
                  {/*<div className={employeeStyles.fieldsContainer}>*/}
                    {/*<Input*/}
                      {/*onChangeHandler={this.onChangeSecondaryNameOfSchool}*/}
                      {/*showLabel*/}
                      {/*name="* Name of school (Write in full)"/>*/}
                    {/*<div className={employeeStyles.row}>*/}
                      {/*<DatePicker*/}

                        {/*placeholder="From"*/}
                        {/*showLabel/>*/}
                      {/*<DatePicker*/}

                        {/*placeholder="To"*/}
                        {/*showLabel/>*/}
                    {/*</div>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="Highest level / Units earned (If not graduated)"/>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="Scholarship / Academic honors received"/>*/}
                  {/*</div>*/}
                {/*</div>*/}
                {/*<div className={employeeStyles.row}>*/}
                  {/*<div className={employeeStyles.rowTitleContainer}>*/}
                    {/*<p>Educational background - Vocational / Trade course</p>*/}
                  {/*</div>*/}
                  {/*<div className={employeeStyles.fieldsContainer}>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="* Name of school (Write in full)"/>*/}
                    {/*<div className={employeeStyles.row}>*/}
                      {/*<DatePicker*/}
                        {/*placeholder="From"*/}
                        {/*showLabel/>*/}
                      {/*<DatePicker*/}
                        {/*placeholder="To"*/}
                        {/*showLabel/>*/}
                    {/*</div>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="Highest level / Units earned (If not graduated)"/>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="Scholarship / Academic honors received"/>*/}
                  {/*</div>*/}
                {/*</div>*/}
                {/*<div className={employeeStyles.row}>*/}
                  {/*<div className={employeeStyles.rowTitleContainer}>*/}
                    {/*<p>Educational background - College</p>*/}
                  {/*</div>*/}
                  {/*<div className={employeeStyles.fieldsContainer}>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="* Name of school (Write in full)"/>*/}
                    {/*<div className={employeeStyles.row}>*/}
                      {/*<DatePicker*/}
                        {/*placeholder="From"*/}
                        {/*showLabel/>*/}
                      {/*<DatePicker*/}
                        {/*placeholder="To"*/}
                        {/*showLabel/>*/}
                    {/*</div>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="Highest level / Units earned (If not graduated)"/>*/}
                    {/*<Input*/}
                      {/*showLabel*/}
                      {/*name="Scholarship / Academic honors received"/>*/}
                  {/*</div>*/}
                {/*</div>*/}
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
                      value={this.state.personalDataSheet.civilServiceEligibility}
                      placeholder="Eligibility"
                      options={this.state.eligibilities}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
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

