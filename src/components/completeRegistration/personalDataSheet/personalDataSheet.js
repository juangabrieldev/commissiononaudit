import React, {Component, Fragment} from 'react';
import produce from 'immer';
import {RadioGroup, Radio} from 'react-radio-group'
import {connect} from 'react-redux';

import Input from "../../input/input";
import DatePicker from '../../datePicker/datePicker';

import univStyles from '../../home/styles.scss';
import Button from "../../button/button";
import styles from "./personalDataSheet.scss";

class PersonalDataSheet extends Component {
  state = {
    personalInformation: {
      firstName: '',
      middleName: '',
      lastName: '',
      nameExtension: '', //Jr., III, etc.
      dateOfBirth: '',
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
        highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
        yearGraduated: null,
        scholarshipAcademicHonorsReceived: null
      },
      secondary: {
        nameOfSchool: null,
        basicEducationDegreeCourse: null,
        periodOfAttendance: {
          from: null,
          to: null
        },
        highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
        yearGraduated: null,
        scholarshipAcademicHonorsReceived: null
      },
      vocational: {
        nameOfSchool: null,
        basicEducationDegreeCourse: null,
        periodOfAttendance: {
          from: null,
          to: null
        },
        highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
        yearGraduated: null,
        scholarshipAcademicHonorsReceived: null
      },
      college: {
        nameOfSchool: null,
        basicEducationDegreeCourse: null, //this is id. accountancy is 23
        periodOfAttendance: {
          from: null,
          to: null
        },
        highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
        yearGraduated: null,
        scholarshipAcademicHonorsReceived: null
      },
      graduateStudies: {
        nameOfSchool: null,
        basicEducationDegreeCourse: null,
        periodOfAttendance: {
          from: null,
          to: null
        },
        highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
        yearGraduated: null,
        scholarshipAcademicHonorsReceived: null
      },
    },
    trainings: [],
    // example format
    // {
    //   name: null
    //   attendance: {
    //     from: null,
    //     to: null
    //   },
    //   numberOfHours: null,
    //   typeOfLd: null,
    //   conductedSponsoredBy: null
    // }
  };

  onChangeDateOfBirth = o => {
    this.setState(produce(draft => {
      draft.personalInformation.dateOfBirth = o;
    }))
  };

  onChangeGender = o => {
    console.log(o);
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

  render() {
    const pdsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Personal Data Sheet</p>
      </div>;

    const bottomBar =
      <div className={univStyles.titleBar + ' ' + univStyles.singleButton + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <Button disabled={!this.state.croppedImage} onClick={this.onSave} width={70} classNames={['tertiary']} name="NEXT"/>
      </div>;

    return (
      <Fragment>
        {pdsTitleBar}
        {bottomBar}
        <div className={univStyles.main}>
          <div className={univStyles.pageMain}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>Fill up your personal data sheet</p>
              </div>
              <div className={univStyles.formBody} style={{marginBottom: 50, padding: 15}}>
                <div className={styles.inside}>
                  <div className={styles.left}>
                    <div className={univStyles.groupOfFields}>
                      <p className={univStyles.title}>PERSONAL INFORMATION</p>
                      <div className={styles.firstRow}>
                        <Input value={this.state.personalInformation.lastName} name="* Surname"/>
                        <Input value={this.state.personalInformation.firstName} name="* First name"/>
                        <Input value={this.state.personalInformation.middleName} name="Middle name"/>
                        <Input value={this.state.personalInformation.nameExtension} name="Name extension"/>
                      </div>
                      <div className={styles.secondRow}>
                        <DatePicker placeholder="Date of birth" selected={this.state.personalInformation.dateOfBirth} onChange={e => this.onChangeDateOfBirth(e)} />
                        <div className={styles.checkBox}>
                          <p className={styles.title}>Gender</p>
                          <RadioGroup name="gender" selectedValue={this.state.personalInformation.sex} onChange={this.onChangeGender}>
                            <Radio value="Male" />
                            <p>Male</p>
                            <Radio value="Female" />
                            <p>Female</p>
                          </RadioGroup>
                        </div>
                        <Input name="Place of birth"/>
                        <div className={styles.checkBox}>
                          <p className={styles.title}>Civil status</p>
                          <RadioGroup name="civilstatus" selectedValue={this.state.personalInformation.civilStatus} onChange={this.onChangeCivilStatus}>
                            <Radio value="Single" />
                            <p>Single</p>
                            <Radio value="Married" />
                            <p>Married</p>
                            <Radio value="Widowed" />
                            <p>Widowed</p>
                            <Radio value="Separated" />
                            <p>Separated</p>
                          </RadioGroup>
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
                      <p className={styles.annotation}>Residential Address</p>
                      <div className={styles.fifthRow}>
                        <Input name="House / Block / Lot No."/>
                        <Input name="Subdivision / Village"/>
                        <Input name="City / Municipality"/>
                        <Input name="Province"/>
                        <Input name="Zip code"/>
                      </div>
                      <p className={styles.annotation}>Permanent Address</p>
                      <div className={styles.sixthRow}>
                        <Input name="House / Block / Lot No."/>
                        <Input name="Subdivision / Village"/>
                        <Input name="City / Municipality"/>
                        <Input name="Province"/>
                        <Input name="Zip code"/>
                      </div>
                      <div className={styles.seventhRow}>
                        <Input name="Telephone No."/>
                        <Input name="Mobile No."/>
                        <Input name="E-mail address (if any)"/>
                      </div>
                    </div>
                    <div style={{marginTop: 25}} className={univStyles.groupOfFields}>
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
                    </div>
                  </div>
                  {/*<div className={styles.right}>*/}

                  {/*</div>*/}
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
