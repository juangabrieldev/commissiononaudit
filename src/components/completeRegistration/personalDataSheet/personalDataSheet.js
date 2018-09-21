import React, {Component, Fragment} from 'react';
import produce from 'immer';
import {Radio, RadioGroup} from 'react-radio-group'
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import Input from "../../input/input";
import DatePicker from '../../datePicker/datePicker';
import Numeric from "../../numeric/numeric";
import Select from "../../select/select";

import univStyles from '../../home/styles.scss';
import Button from "../../button/button";
import styles from "./personalDataSheet.scss";

import {employees, qualificationStandards} from "../../../api";

class PersonalDataSheet extends Component {
  state = {
    personalInformation: {
      firstName: '',
      middleName: '',
      lastName: '',
      nameExtension: '', //Jr., III, etc.
      dateOfBirth: null,
      placeOfBirth: '',
      sex: '',
      civilStatus: null,
      height: null, //in meters
      weight: null, //in kg
      bloodType: null,
      gsisIdNo: null,
      pagIbigIdNo: null,
      philHealthIdNo: null,
      sssNo: null,
      tinNo: null,
      agencyEmployeeNo: null,
      citizenship: null,
      residentialAddress: {
        houseBlockLotNo: null,
        street: null,
        subdivisionVillage: null,
        barangay: null,
        cityMunicipality: null,
        province: null,
        zipCode: null
      },
      permanentAddress: {
        houseBlockLotNo: null,
        street: null,
        subdivisionVillage: null,
        barangay: null,
        cityMunicipality: null,
        province: null,
        zipCode: null
      },
      telephoneNo: null,
      mobileNo: null,
      emailAddress: null
    },
    familyBackground: {
      spouseLastName: null,
      spouseFirstName: null,
      spouseMiddleName: null,
      spouseNameExtension: null,
      numberOfChildren: 0,
      nameOfChildren: [], //example['Juan Dela Cruz', 'Andres Bonifcation']
      fatherLastName: null,
      fatherFirstName: null,
      fatherMiddleName: null,
      fatherNameExtension: null,
      motherMaidenName: null,
      motherFirstName: null,
      motherMiddleName: null,
      motherNameExtension: null,
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
        yearGraduated: null,
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
        yearGraduated: null,
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
        yearGraduated: null,
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
        yearGraduated: null,
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
        yearGraduated: null,
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

    //region apiData
    eligibilities: [],
    trainings: [],
    selectedTrainings: [],
    courses: [],
    //endregion

    //region pagination
    pages: 5,
    currentPage: 5
    //endregion
  };

  //region personalInformation
  onChangeDateOfBirth = o => {
    this.setState(produce(draft => {
      draft.personalInformation.dateOfBirth = o;
    }))
  };

  onChangeGender = o => {
    this.setState(produce(draft => {
      draft.personalInformation.sex = o
    }))
  };

  onChangeCivilStatus = o => {
    console.log(o);
    this.setState(produce(draft => {
      draft.personalInformation.civilStatus = o
    }))
  };
  //endregion

  //region familyBackground
  onChangeNumberOfChildren = v => {
    console.log(v);
    this.setState(produce(draft => {
      draft.familyBackground.numberOfChildren = v;

      if (v < this.state.familyBackground.numberOfChildren) {
        draft.familyBackground.nameOfChildren.pop()
      } else {
        draft.familyBackground.nameOfChildren.push({
          name: null,
          dateOfBirth: null
        })
      }
    }))
  };

  onChangeNameOfChildren = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.familyBackground.nameOfChildren[i].name = value
    }));
  };

  onChangeDateOfBirthOfChildren = (o, i) => {
    const date = o;

    this.setState(produce(draft => {
      draft.familyBackground.nameOfChildren[i].dateOfBirth = date
    }))
  };
  //endregion

  //region educationalBackground

  //region elementary
  onChangeElementaryScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.elementary.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddElementaryScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.elementary.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveElementaryScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.elementary.scholarshipAcademicHonorsReceived.pop()
    }))
  };

  onChangeElementaryNameOfSchool = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.elementary.nameOfSchool = value
    }));
  };

  onChangeElementaryFrom = o => {
    console.log(o);
    this.setState(produce(draft => {
      draft.educationalBackground.elementary.periodOfAttendance.from = o
    }))
  };

  onChangeElementaryTo = o => {
    this.setState(produce(draft => {
      draft.educationalBackground.elementary.periodOfAttendance.to = o
    }))
  };

  onChangeElementaryHighestLevel = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.elementary.highestLevelUnitsEarned = value;
    }))
  };
  //endregion

  //region secondary
  onChangeSecondaryScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.secondary.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddSecondaryScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.secondary.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveSecondaryScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.secondary.scholarshipAcademicHonorsReceived.pop()
    }))
  };

  onChangeSecondaryNameOfSchool = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.secondary.nameOfSchool = value
    }));
  };

  onChangeSecondaryFrom = o => {
    this.setState(produce(draft => {
      draft.educationalBackground.secondary.periodOfAttendance.from = o
    }))
  };

  onChangeSecondaryTo = o => {
    this.setState(produce(draft => {
      draft.educationalBackground.secondary.periodOfAttendance.to = o
    }))
  };

  onChangeSecondaryHighestLevel = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.secondary.highestLevelUnitsEarned = value;
    }))
  };
  //endregion

  //region vocational
  onChangeVocationalScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.vocational.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddVocationalScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.vocational.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveVocationalScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.vocational.scholarshipAcademicHonorsReceived.pop()
    }))
  };
  //endregion

  //region college
  onChangeCollegeCourse = o => {
    this.setState(produce(draft => {
      draft.educationalBackground.college.basicEducationDegreeCourse = o;
    }))
  };

  onChangeCollegeScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.college.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddCollegeScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.college.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveCollegeScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.college.scholarshipAcademicHonorsReceived.pop()
    }))
  };

  onChangeCollegeNameOfSchool = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.college.nameOfSchool = value
    }));
  };

  onChangeCollegeFrom = o => {
    this.setState(produce(draft => {
      draft.educationalBackground.college.periodOfAttendance.from = o
    }))
  };

  onChangeCollegeTo = o => {
    this.setState(produce(draft => {
      draft.educationalBackground.college.periodOfAttendance.to = o
    }))
  };

  onChangeCollegeHighestLevel = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.college.highestLevelUnitsEarned = value;
    }))
  };
  //endregion

  //region graduateStudies
  onChangeGraduateStudiesScholarship = (e, i) => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived[i] = value;
    }))
  };

  onAddGraduateStudiesScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived.push('');
    }))
  };

  onRemoveGraduateStudiesScholarship = () => {
    this.setState(produce(draft => {
      draft.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived.pop()
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
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.workExperienceWithinCoa[i].positionTitle = value;
    }))
  };

  onChangeWorkExperienceWithinCoaOfficeName = (e, i) => {
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

    this.setState(produce(draft => {
      draft.trainingsAttended[i].training = o;

      //if user removes the selected training
      if(o == null) {
        //remove the previously selected option to selectedTrainings
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

        console.log(selectedTrainings)
      })
    }));
  };
  //endregion

  componentDidMount = () => {
    let courses, eligibilities, trainings;
    let personalDataSheet;


    axios.get(qualificationStandards.courses)
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

        return axios.get(employees.personalDataSheet + this.props.employeeId)
      })
      .then(res => {
        // this.setState({courses, eligibilities, trainings});

        const { personalDataSheet } = res.data.data;

        //region convert educationalBagckground dates to moment object
        personalDataSheet.educationalBackground.elementary.periodOfAttendance.from = moment(
          personalDataSheet.educationalBackground.elementary.periodOfAttendance.from
        );
        personalDataSheet.educationalBackground.elementary.periodOfAttendance.to = moment(
          personalDataSheet.educationalBackground.elementary.periodOfAttendance.to
        );

        personalDataSheet.educationalBackground.secondary.periodOfAttendance.from = moment(
          personalDataSheet.educationalBackground.secondary.periodOfAttendance.from
        );
        personalDataSheet.educationalBackground.secondary.periodOfAttendance.to = moment(
          personalDataSheet.educationalBackground.secondary.periodOfAttendance.to
        );

        personalDataSheet.educationalBackground.vocational.periodOfAttendance.from = moment(
          personalDataSheet.educationalBackground.vocational.periodOfAttendance.from
        );
        personalDataSheet.educationalBackground.vocational.periodOfAttendance.to = moment(
          personalDataSheet.educationalBackground.vocational.periodOfAttendance.to
        );

        personalDataSheet.educationalBackground.college.periodOfAttendance.from = moment(
          personalDataSheet.educationalBackground.college.periodOfAttendance.from
        );
        personalDataSheet.educationalBackground.college.periodOfAttendance.to = moment(
          personalDataSheet.educationalBackground.college.periodOfAttendance.to
        );

        personalDataSheet.educationalBackground.graduateStudies.periodOfAttendance.from = moment(
          personalDataSheet.educationalBackground.graduateStudies.periodOfAttendance.from
        );
        personalDataSheet.educationalBackground.graduateStudies.periodOfAttendance.to = moment(
          personalDataSheet.educationalBackground.graduateStudies.periodOfAttendance.to
        );
        //endregion

        this.setState({
          courses,
          eligibilities,
          trainings,
          educationalBackground: {
            ...personalDataSheet.educationalBackground
          }
        });

        this.setState(produce(draft => {
          draft.courses = courses;
          draft.eligibilities = eligibilities;
          draft.trainings = trainings;
          draft.educationalBackground = {...personalDataSheet.educationalBackground};
          draft.trainingsAttended[0].dataSource = trainings;
        }));
      })
  };

  onNext = () => {
    if(this.state.currentPage === 5) {
      axios.post(employees.completeRegistration + this.props.employeeId, {
        personalDataSheet: {
          educationalBackground: this.state.educationalBackground,
          eligibilities: this.state.eligibilities,
          workExperience: this.state.workExperience,
          trainingsAttended: this.state.trainingsAttended
        }
      })
        .then(res => console.log(res.data.data));
    }
    this.setState(produce(draft => {
      draft.currentPage < 5 ? draft.currentPage += 1 : null
    }), this.switchPage)
  };

  onGoBack = () => {
    this.setState(produce(draft => {
      draft.currentPage > 1 ? draft.currentPage -= 1 : null
    }), this.switchPage)
  };

  switchPage = () => {
    switch (this.state.currentPage) {
      case 1: {
        scrollToComponent(this.refs.educationalBackground, {
          duration: 300,
          align: 'top',
          offset: -200
        });

        this.refs.educationalBackground.childNodes[2].childNodes[0].childNodes[1].focus();

        break;
      }

      case 2: {
        scrollToComponent(this.refs.civilServiceEligibility, {
          duration: 300
        });

        this.refs.civilServiceEligibility.childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].focus();

        break;
      }

      case 3: {
        scrollToComponent(this.refs.workExperienceOutsideCoa, {
          duration: 300
        });

        this.refs.workExperienceOutsideCoa.childNodes[1].childNodes[0].childNodes[0].childNodes[1].focus();

        break;
      }

      case 4: {
        scrollToComponent(this.refs.workExperienceWithinCoa, {
          duration: 300
        });

        this.refs.workExperienceWithinCoa.childNodes[1].childNodes[0].childNodes[0].childNodes[1].focus();

        break;
      }

      case 5: {
        scrollToComponent(this.refs.trainingsAttended, {
          duration: 300
        });

        this.refs.trainingsAttended.
          childNodes[1].childNodes[0].
          childNodes[0].childNodes[1].
          childNodes[0].childNodes[0].
          childNodes[1].childNodes[0].
          childNodes[0].focus();

        break;
      }
    }
  };

  handleScroll = e => {
    if (e.pageY > 59) {
      this.setState({isFixed: true})
    } else {
      this.setState({isFixed: false})
    }
  };

  render() {
    const pdsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Personal Data Sheet</p>
      </div>;

    const bottomBar =
      <div
        className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <p style={{fontSize: 16}}>Page {this.state.currentPage} of 4</p>
        <div style={{marginLeft: 'auto', marginRight: 15}}>
          <Button onClick={this.onGoBack} width={70} classNames={['cancel']} name="GO BACK"/>
          <Button style={{marginLeft: 15}} onClick={this.onNext} width={70} classNames={['tertiary']} name="NEXT"/>
        </div>
      </div>;

    const personalInformation =
      <div ref="personalInformation" className={univStyles.groupOfFields}>
        <p className={univStyles.title}>PERSONAL INFORMATION</p>
        <div className={styles.firstRow}>
          <div style={{display: 'flex'}}>
            <Input value={this.state.personalInformation.lastName} name="* Surname"/>
            <Input value={this.state.personalInformation.nameExtension} name="Name extension"/>
          </div>
          <Input value={this.state.personalInformation.firstName} name="* First name"/>
          <Input value={this.state.personalInformation.middleName} name="Middle name"/>
        </div>
        <div className={styles.secondRow}>
          <div style={{display: 'flex'}}>
            <DatePicker
              showYearDropdown
              placeholder="Date of birth"
              selected={this.state.personalInformation.dateOfBirth}
              onChange={e => this.onChangeDateOfBirth(e)}/>
            <div>
              <Input name="Place of birth"/>
            </div>
          </div>
          <div style={{display: 'flex', marginTop: 15}}>
            <div className={styles.checkBox}>
              <p className={styles.title}>Gender</p>
              <RadioGroup name="gender" selectedValue={this.state.personalInformation.sex}
                          onChange={this.onChangeGender}>
                <Radio value="Male"/>
                <p>Male</p>
                <Radio value="Female"/>
                <p>Female</p>
              </RadioGroup>
            </div>
            <div className={styles.checkBox}>
              <p className={styles.title}>Civil status</p>
              <RadioGroup name="civilstatus" selectedValue={this.state.personalInformation.civilStatus}
                          onChange={this.onChangeCivilStatus}>
                <Radio value="Single"/>
                <p>Single</p>
                <Radio value="Married"/>
                <p>Married</p>
                <Radio value="Widowed"/>
                <p>Widowed</p>
                <Radio value="Separated"/>
                <p>Separated</p>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div className={styles.thirdRow}>
          <Input name="Height (m)"/>
          <Input name="Weight (kg)"/>
          <Input name="GSIS ID No."/>
          <Input name="PAG-IBIG ID No."/>
        </div>
        <div className={styles.fourthRow}>
          <Input name="Phil-Health ID No."/>
          <Input name="SSS No."/>
          <Input name="TIN No."/>
          <Input name="Agency Employee No."/>
        </div>
        <div className={styles.hr}/>
        <p className={styles.annotation}>Residential Address</p>
        <div className={styles.fifthRow}>
          <Input name="House / Block / Lot No."/>
          <Input name="Subdivision / Village"/>
          <Input name="City / Municipality"/>
          <Input name="Province"/>
          <Input name="Zip code"/>
        </div>
        <div className={styles.hr}/>
        <p className={styles.annotation}>Permanent Address</p>
        <div className={styles.sixthRow}>
          <Input name="House / Block / Lot No."/>
          <Input name="Subdivision / Village"/>
          <Input name="City / Municipality"/>
          <Input name="Province"/>
          <Input name="Zip code"/>
        </div>
        <div className={styles.hr}/>
        <div className={styles.seventhRow}>
          <Input name="Telephone No."/>
          <Input name="Mobile No."/>
          <Input name="E-mail address (if any)"/>
        </div>
      </div>;

    const familyBackground =
      <div ref="familyBackground" style={{marginTop: 25}} className={univStyles.groupOfFields}>
        <p className={univStyles.title}>FAMILY BACKGROUND</p>
        <div className={styles.eightRow}>
          <Input value={this.state.personalInformation.lastName} name="Spouse's Surname"/>
          <Input value={this.state.personalInformation.firstName} name="* First name"/>
          <Input value={this.state.personalInformation.middleName} name="Middle name"/>
          <Input value={this.state.personalInformation.nameExtension} name="Name extension"/>
        </div>
        <div className={styles.ninthRow}>
          <Input value={this.state.personalInformation.lastName} name="Ocupation"/>
          <Input value={this.state.personalInformation.firstName} name="Employer / Business name"/>
          <Input value={this.state.personalInformation.middleName} name="Business Address"/>
          <Input value={this.state.personalInformation.nameExtension} name="Telephone No."/>
        </div>
        <div className={styles.hr}/>
        <div className={styles.tenthRow}>
          <Input value={this.state.personalInformation.lastName} name="Father's Surname"/>
          <Input value={this.state.personalInformation.firstName} name="First name"/>
          <Input value={this.state.personalInformation.middleName} name="Middle name"/>
          <Input value={this.state.personalInformation.nameExtension} name="Name extension"/>
        </div>
        <div className={styles.hr}/>
        <div className={styles.eleventhRow}>
          <Input value={this.state.personalInformation.lastName} name="Mother's maiden name"/>
          <Input value={this.state.personalInformation.firstName} name="First name"/>
          <Input value={this.state.personalInformation.middleName} name="Middle name"/>
          <Input value={this.state.personalInformation.nameExtension} name="Last name"/>
        </div>
        <div className={styles.hr}/>
        <div className={styles.twelfthRow}>
          <div style={{width: '24.02%'}}>
            <Numeric
              disabledTyping
              onChangeHandler={this.onChangeNumberOfChildren}
              name="Number of children"/>
          </div>
          <div className={styles.children}>
            {
              Array(this.state.familyBackground.numberOfChildren).fill().map((e, i) => {
                return (
                  <div>
                    <Input
                      onChangeHandler={e => this.onChangeNameOfChildren(e, i)}
                      value={this.state.familyBackground.nameOfChildren[i].name}
                      name="Full name"/>
                    <DatePicker
                      showYearDropdown
                      popperPlacement="top-middle"
                      popperModifiers={{
                        preventOverflow: {
                          enabled: true,
                          escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                          boundariesElement: 'viewport'
                        }
                      }}
                      placeholder="Date of birth"
                      selected={this.state.familyBackground.nameOfChildren[i].dateOfBirth}
                      onChange={o => this.onChangeDateOfBirthOfChildren(o, i)}/>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>;

    const educationalBackground =
      <div ref="educationalBackground"
           className={univStyles.groupOfFields + (this.state.currentPage === 1 ? ' ' + univStyles.current : ' ' + univStyles.notCurrent)}>
        <p className={univStyles.title}>EDUCATIONAL BACKGROUND</p>
        {/*Elementary*/}
        <Fragment>
          <p className={styles.annotation}>Elementary</p>
          <div className={styles.thirteenthRow}>
            <Input
              onChangeHandler={this.onChangeElementaryNameOfSchool}
              value={this.state.educationalBackground.elementary.nameOfSchool}
              name="* Name of school (Write in full)"/>
            <DatePicker
              onChange={this.onChangeElementaryFrom}
              selected={this.state.educationalBackground.elementary.periodOfAttendance.from}
              showYearDropdown
              placeholder="From"/>
            <DatePicker
              onChange={this.onChangeElementaryTo}
              selected={this.state.educationalBackground.elementary.periodOfAttendance.to}
              showYearDropdown
              placeholder="To"/>
          </div>
          <div className={styles.fourteenthRow}>
            <div>
              <Input
                onChangeHandler={this.onChangeElementaryHighestLevel}
                value={this.state.educationalBackground.elementary.highestLevelUnitsEarned}
                name="Highest level / Units earned (If not graduated)"/>
            </div>
            <div>
              {
                this.state.educationalBackground.elementary.scholarshipAcademicHonorsReceived.map((e, i) => {
                  return (
                    <Input
                      key={i}
                      onChangeHandler={e => this.onChangeElementaryScholarship(e, i)}
                      value={this.state.educationalBackground.elementary.scholarshipAcademicHonorsReceived[i]}
                      name="Scholarship / Academic Honors received"/>
                  )
                })
              }
              {
                this.state.educationalBackground.elementary.scholarshipAcademicHonorsReceived[0].length > 0 ?
                  <p>
                    {
                      this.state.educationalBackground.elementary.scholarshipAcademicHonorsReceived.length > 1 ?
                        <Fragment>
                          <span onClick={this.onRemoveElementaryScholarship} className={styles.remove}>REMOVE</span>
                          &nbsp;&nbsp;or&nbsp;&nbsp;
                        </Fragment> :
                        null
                    }
                    <span onClick={this.onAddElementaryScholarship} className={styles.addMore}>ADD MORE</span>
                  </p> :
                  null
              }
            </div>
          </div>
        </Fragment>
        <div className={styles.hr}/>
        {/*Secondary*/}
        <Fragment>
          <p className={styles.annotation}>Secondary</p>
          <div className={styles.thirteenthRow}>
            <Input
              onChangeHandler={this.onChangeSecondaryNameOfSchool}
              value={this.state.educationalBackground.secondary.nameOfSchool}
              name="* Name of school (Write in full)"/>
            <DatePicker
              onChange={this.onChangeSecondaryFrom}
              selected={this.state.educationalBackground.secondary.periodOfAttendance.from}
              showYearDropdown
              placeholder="From"/>
            <DatePicker
              onChange={this.onChangeSecondaryTo}
              selected={this.state.educationalBackground.secondary.periodOfAttendance.to}
              showYearDropdown
              placeholder="To"/>
          </div>
          <div className={styles.fourteenthRow}>
            <div>
              <Input
                onChangeHandler={this.onChangeSecondaryHighestLevel}
                value={this.state.educationalBackground.secondary.highestLevelUnitsEarned}
                name="Highest level / Units earned (If not graduated)"/>
            </div>
            <div>
              {
                this.state.educationalBackground.secondary.scholarshipAcademicHonorsReceived.map((e, i) => {
                  return (
                    <Input
                      key={i}
                      onChangeHandler={e => this.onChangeSecondaryScholarship(e, i)}
                      value={this.state.educationalBackground.secondary.scholarshipAcademicHonorsReceived[i]}
                      name="Scholarship / Academic Honors received"/>
                  )
                })
              }
              {
                this.state.educationalBackground.secondary.scholarshipAcademicHonorsReceived[0].length > 0 ?
                  <p>
                    {
                      this.state.educationalBackground.secondary.scholarshipAcademicHonorsReceived.length > 1 ?
                        <Fragment>
                          <span onClick={this.onRemoveSecondaryScholarship} className={styles.remove}>REMOVE</span>
                          &nbsp;&nbsp;or&nbsp;&nbsp;
                        </Fragment> :
                        null
                    }
                    <span onClick={this.onAddSecondaryScholarship} className={styles.addMore}>ADD MORE</span>
                  </p> :
                  null
              }
            </div>
          </div>
        </Fragment>
        <div className={styles.hr}/>
        {/*Vocational*/}
        <Fragment>
          <p className={styles.annotation}>Vocational / Trade course</p>
          <div className={styles.thirteenthRow}>
            <Input
              onChangeHandler={this.onChangeSecondaryNameOfSchool}
              value={this.state.educationalBackground.vocational.nameOfSchool}
              name="* Name of school (Write in full)"/>
            <Input
              value={''}
              name="* Basic education / Degree / Course"/>
            <DatePicker
              showYearDropdown
              placeholder="From"/>
            <DatePicker
              showYearDropdown
              placeholder="To"/>
          </div>
          <div className={styles.fourteenthRow}>
            <div>
              <Input name="Highest level / Units earned (If not graduated)"/>
            </div>
            <div>
              {
                this.state.educationalBackground.vocational.scholarshipAcademicHonorsReceived.map((e, i) => {
                  return (
                    <Input
                      key={i}
                      onChangeHandler={e => this.onChangeVocationalScholarship(e, i)}
                      value={this.state.educationalBackground.vocational.scholarshipAcademicHonorsReceived[i]}
                      name="Scholarship / Academic Honors received"/>
                  )
                })
              }
              {
                this.state.educationalBackground.vocational.scholarshipAcademicHonorsReceived[0].length > 0 ?
                  <p>
                    {
                      this.state.educationalBackground.vocational.scholarshipAcademicHonorsReceived.length > 1 ?
                        <Fragment>
                          <span onClick={this.onRemoveVocationalScholarship} className={styles.remove}>REMOVE</span>
                          &nbsp;&nbsp;or&nbsp;&nbsp;
                        </Fragment> :
                        null
                    }
                    <span onClick={this.onAddVocationalScholarship} className={styles.addMore}>ADD MORE</span>
                  </p> :
                  null
              }
            </div>
          </div>
        </Fragment>
        <div className={styles.hr}/>
        {/*College*/}
        <Fragment>
          <p className={styles.annotation}>College</p>
          <div className={styles.thirteenthRow}>
            <Input
              onChangeHandler={this.onChangeCollegeNameOfSchool}
              value={this.state.educationalBackground.college.nameOfSchool}
              name="* Name of school (Write in full)"/>
            <Select
              value={this.state.educationalBackground.college.basicEducationDegreeCourse}
              options={this.state.courses}
              onChangeHandler={this.onChangeCollegeCourse}
              placeholder="* Basic education / Degree / Course"
              isClearable/>
            <DatePicker
              onChange={this.onChangeCollegeFrom}
              selected={this.state.educationalBackground.college.periodOfAttendance.from}
              showYearDropdown
              placeholder="From"/>
            <DatePicker
              onChange={this.onChangeCollegeTo}
              selected={this.state.educationalBackground.college.periodOfAttendance.to}
              showYearDropdown
              placeholder="To"/>
          </div>
          <div className={styles.fourteenthRow}>
            <div>
              <Input name="Highest level / Units earned (If not graduated)"/>
            </div>
            <div>
              {
                this.state.educationalBackground.college.scholarshipAcademicHonorsReceived.map((e, i) => {
                  return (
                    <Input
                      key={i}
                      onChangeHandler={e => this.onChangeCollegeScholarship(e, i)}
                      value={this.state.educationalBackground.college.scholarshipAcademicHonorsReceived[i]}
                      name="Scholarship / Academic Honors received"/>
                  )
                })
              }
              {
                this.state.educationalBackground.college.scholarshipAcademicHonorsReceived[0].length > 0 ?
                  <p>
                    {
                      this.state.educationalBackground.college.scholarshipAcademicHonorsReceived.length > 1 ?
                        <Fragment>
                          <span onClick={this.onRemoveCollegeScholarship} className={styles.remove}>REMOVE</span>
                          &nbsp;&nbsp;or&nbsp;&nbsp;
                        </Fragment> :
                        null
                    }
                    <span onClick={this.onAddCollegeScholarship} className={styles.addMore}>ADD MORE</span>
                  </p> :
                  null
              }
            </div>
          </div>
        </Fragment>
        <div className={styles.hr}/>
        <p className={styles.annotation}>Graduate studies</p>
        <div className={styles.thirteenthRow}>
          <Input
            value={''}
            name="* Name of school (Write in full)"/>
          <Input
            value={''}
            name="* Basic education / Degree / Course"/>
          <DatePicker
            showYearDropdown
            placeholder="From"/>
          <DatePicker
            showYearDropdown
            placeholder="To"/>
        </div>
        <div className={styles.fourteenthRow}>
          <div>
            <Input name="Highest level / Units earned (If not graduated)"/>
          </div>
          <div>
            {
              this.state.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived.map((e, i) => {
                return (
                  <Input
                    key={i}
                    onChangeHandler={e => this.onChangeGraduateStudiesScholarship(e, i)}
                    value={this.state.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived[i]}
                    name="Scholarship / Academic Honors received"/>
                )
              })
            }
            {
              this.state.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived[0].length > 0 ?
                <p>
                  {
                    this.state.educationalBackground.graduateStudies.scholarshipAcademicHonorsReceived.length > 1 ?
                      <Fragment>
                        <span onClick={this.onRemoveGraduateStudiesScholarship} className={styles.remove}>REMOVE</span>
                        &nbsp;&nbsp;or&nbsp;&nbsp;
                      </Fragment> :
                      null
                  }
                  <span onClick={this.onAddGraduateStudiesScholarship} className={styles.addMore}>ADD MORE</span>
                </p> :
                null
            }
          </div>
        </div>
      </div>;

    const civilServiceEligibility =
      <div ref="civilServiceEligibility"
           className={univStyles.groupOfFields + (this.state.currentPage === 2 ? ' ' + univStyles.current : ' ' + univStyles.notCurrent)}>
        <p className={univStyles.title}>CIVIL SERVICE ELIGIBILITY</p>
        <div className={univStyles.input}>
          <Select
            isClearable
            isMulti
            onChangeHandler={this.onChangeEligibility}
            value={this.state.civilServiceEligibility}
            placeholder="Eligibility"
            options={this.state.eligibilities}/>
        </div>
      </div>;

    const workExperienceOutsideCoa =
      <div ref="workExperienceOutsideCoa"
           className={univStyles.groupOfFields + (this.state.currentPage === 3 ? ' ' + univStyles.current : ' ' + univStyles.notCurrent)}>
        <p className={univStyles.title}>WORK EXPERIENCE OUTSIDE COMMISSION ON AUDIT</p>
        <div className={styles.thirteenthRow}>
          {
            this.state.workExperienceOutsideCoa.map((e, i, a) => {
              return (
                <Fragment key={i}>
                  <div className={styles.workExperience}>
                    <Input
                      onChangeHandler={e => this.onChangeWorkExperienceOutsideCoa(e, i)}
                      value={this.state.workExperienceOutsideCoa[i].positionTitle}
                      name="Position title"/>
                    <Input
                      onChangeHandler={e => this.onChangeWorkExperienceOutsideCoaCompanyName(e, i)}
                      value={this.state.workExperienceOutsideCoa[i].companyName}
                      name="Company name"/>
                    <DatePicker
                      selected={this.state.workExperienceOutsideCoa[i].from}
                      onChange={o => this.onChangeWorkExperienceOutsideCoaFrom(o, i)}
                      value={this.state.workExperienceOutsideCoa[i].from}
                      showYearDropdown
                      placeholder="From"/>
                    <DatePicker
                      selected={this.state.workExperienceOutsideCoa[i].to}
                      onChange={o => this.onChangeWorkExperienceOutsideCoaTo(o, i)}
                      value={this.state.workExperienceOutsideCoa[i].to}
                      showYearDropdown
                      placeholder="To"/>
                  </div>
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
            this.state.workExperienceOutsideCoa[0].positionTitle.length > 0 ?
              <p style={{margin: 0, marginTop: 5}}>
                {
                  this.state.workExperienceOutsideCoa.length > 1 ?
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
      </div>;

    const workExperienceWithinCoa =
      <div ref="workExperienceWithinCoa"
           className={univStyles.groupOfFields + (this.state.currentPage === 4 ? ' ' + univStyles.current : ' ' + univStyles.notCurrent)}>
        <p className={univStyles.title}>WORK EXPERIENCE WITHIN COMMISSION ON AUDIT</p>
        <div className={styles.thirteenthRow}>
          {
            this.state.workExperienceWithinCoa.map((e, i, a) => {
              return (
                <Fragment key={i}>
                  <div className={styles.workExperience}>
                    <Input
                      onChangeHandler={e => this.onChangeWorkExperienceWithinCoa(e, i)}
                      value={this.state.workExperienceWithinCoa[i].positionTitle}
                      name="Position title"/>
                    <Input
                      onChangeHandler={e => this.onChangeWorkExperienceWithinCoaOfficeName(e, i)}
                      value={this.state.workExperienceWithinCoa[i].officeName}
                      name="Office name"/>
                    <DatePicker
                      selected={this.state.workExperienceWithinCoa[i].from}
                      onChange={o => this.onChangeWorkExperienceWithinCoaFrom(o, i)}
                      value={this.state.workExperienceWithinCoa[i].from}
                      showYearDropdown
                      placeholder="From"/>
                    <DatePicker
                      selected={this.state.workExperienceWithinCoa[i].to}
                      onChange={o => this.onChangeWorkExperienceWithinCoaTo(o, i)}
                      value={this.state.workExperienceWithinCoa[i].to}
                      showYearDropdown
                      placeholder="To"/>
                  </div>
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
            this.state.workExperienceWithinCoa[0].positionTitle.length > 0 ?
              <p style={{margin: 0, marginTop: 5}}>
                {
                  this.state.workExperienceWithinCoa.length > 1 ?
                    <Fragment>
                      <span onClick={this.onRemoveWorkExperienceWithinCoa} className={styles.remove}>REMOVE</span>
                      &nbsp;&nbsp;or&nbsp;&nbsp;
                    </Fragment> :
                    null
                }
                <span onClick={this.onAddWorkExperienceWithinCoa} className={styles.addMore}>ADD MORE</span>
              </p> :
              null
          }
        </div>
      </div>;

    const trainingsAttended =
      <div ref="trainingsAttended"
           className={univStyles.groupOfFields + (this.state.currentPage === 5 ? ' ' + univStyles.current : ' ' + univStyles.notCurrent)}>
        <p className={univStyles.title}>TRAININGS ATTENDED</p>
        <div className={styles.thirteenthRow}>
          {
            this.state.trainingsAttended.map((e, i, a) => {
              return (
                <Fragment>
                  <div className={styles.trainingsAttended}>
                    <Select
                      isCreatable
                      value={this.state.trainingsAttended[i].training}
                      options={this.state.trainingsAttended[i].dataSource}
                      onChangeHandler={o => this.onChangeTrainingsAttended(o, i)}
                      placeholder="Training title"
                      isClearable/>
                    <Numeric
                      bindValue
                      onChangeHandler={v => this.onChangeTrainingsAttendedHours(v, i)}
                      name="Number of hours"/>
                    <DatePicker
                      maxDate={moment()}
                      selected={this.state.trainingsAttended[i].date}
                      onChange={o => this.onChangeTrainingAttendedDate(o, i)}
                      showYearDropdown
                      placeholder="Date"/>
                  </div>
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
            this.state.trainingsAttended[0].training != null ?
              <p style={{margin: 0, marginTop: 5}}>
                {
                  this.state.trainingsAttended.length > 1 ?
                    <Fragment>
                      <span onClick={this.onRemoveTrainingsAttended} className={styles.remove}>REMOVE</span>
                      &nbsp;&nbsp;or&nbsp;&nbsp;
                    </Fragment> :
                    null
                }
                <span onClick={this.onAddTrainingsAttended} className={styles.addMore}>ADD MORE</span>
              </p> :
              null
          }
        </div>
      </div>;

    return (
      <Fragment>
        {pdsTitleBar}
        {bottomBar}
        <div className={univStyles.main}>
          <div className={univStyles.pageMain}>
            <div className={univStyles.form} style={{marginBottom: 400}}>
              <div className={univStyles.header}>
                <p>Fill up your personal data sheet</p>
              </div>
              <div className={univStyles.formBody} style={{marginBottom: 50, padding: 15}}>
                <div className={styles.inside}>
                  <div className={styles.left}>
                    {educationalBackground}
                    {civilServiceEligibility}
                    {workExperienceOutsideCoa}
                    {workExperienceWithinCoa}
                    {trainingsAttended}
                  </div>
                  <div className={styles.right}>

                  </div>
                </div>
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
    employeeId: state.authentication.employeeId,
  }
};

export default connect(mapStateToProps)(PersonalDataSheet);
