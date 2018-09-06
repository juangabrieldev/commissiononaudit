import React, {Component, Fragment} from 'react';
import produce from 'immer';
import {RadioGroup, Radio} from 'react-radio-group'
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';

import AutoComplete from '../../autoComplete/autoComplete';
import Input from "../../input/input";
import DatePicker from '../../datePicker/datePicker';
import Numeric from "../../numeric/numeric";

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
    current: false,
    isFixed: false
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

      if(v < this.state.familyBackground.numberOfChildren) {
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


  onNext = () => {

  };

  handleScroll = e => {
    if(e.pageY > 59) {
      this.setState({ isFixed: true })
    } else {
      this.setState({ isFixed: false })
    }
  };

  render() {
    const pdsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Personal Data Sheet</p>
      </div>;

    const bottomBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <p style={{fontSize: 16}}>Page 2 of 6</p>
        <Button onClick={this.onNext} width={70} classNames={['cancel']} name="GO BACK"/>
        <Button onClick={this.onNext} width={70} classNames={['tertiary']} name="NEXT"/>
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
                            onChange={e => this.onChangeDateOfBirth(e)} />
                          <div>
                            <Input name="Place of birth"/>
                          </div>
                        </div>
                        <div style={{display: 'flex', marginTop: 15}}>
                          <div className={styles.checkBox}>
                            <p className={styles.title}>Gender</p>
                            <RadioGroup name="gender" selectedValue={this.state.personalInformation.sex} onChange={this.onChangeGender}>
                              <Radio value="Male" />
                              <p>Male</p>
                              <Radio value="Female" />
                              <p>Female</p>
                            </RadioGroup>
                          </div>
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
                      <div className={styles.hr} />
                      <p className={styles.annotation}>Residential Address</p>
                      <div className={styles.fifthRow}>
                        <Input name="House / Block / Lot No."/>
                        <Input name="Subdivision / Village"/>
                        <Input name="City / Municipality"/>
                        <Input name="Province"/>
                        <Input name="Zip code"/>
                      </div>
                      <div className={styles.hr} />
                      <p className={styles.annotation}>Permanent Address</p>
                      <div className={styles.sixthRow}>
                        <Input name="House / Block / Lot No."/>
                        <Input name="Subdivision / Village"/>
                        <Input name="City / Municipality"/>
                        <Input name="Province"/>
                        <Input name="Zip code"/>
                      </div>
                      <div className={styles.hr} />
                      <div className={styles.seventhRow}>
                        <Input name="Telephone No."/>
                        <Input name="Mobile No."/>
                        <Input name="E-mail address (if any)"/>
                      </div>
                    </div>
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
                      <div className={styles.hr} />
                      <div className={styles.tenthRow}>
                        <Input value={this.state.personalInformation.lastName} name="Father's Surname"/>
                        <Input value={this.state.personalInformation.firstName} name="First name"/>
                        <Input value={this.state.personalInformation.middleName} name="Middle name"/>
                        <Input value={this.state.personalInformation.nameExtension} name="Name extension"/>
                      </div>
                      <div className={styles.hr} />
                      <div className={styles.eleventhRow}>
                        <Input value={this.state.personalInformation.lastName} name="Mother's maiden name"/>
                        <Input value={this.state.personalInformation.firstName} name="First name"/>
                        <Input value={this.state.personalInformation.middleName} name="Middle name"/>
                        <Input value={this.state.personalInformation.nameExtension} name="Last name"/>
                      </div>
                      <div className={styles.hr} />
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
                                    onChange={o => this.onChangeDateOfBirthOfChildren(o, i)} />
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                    <div ref="educationalBackground" style={{marginTop: 25}} className={univStyles.groupOfFields}>
                      <p className={univStyles.title}>EDUCATIONAL BACKGROUND</p>
                      <p className={styles.annotation}>Elementary</p>
                      <div className={styles.thirteenthRow}>
                        <Input
                          value={''}
                          name="* Name of school (Write in full)" />
                        <Input
                          value={''}
                          name="* Basic education / Degree / Course" />
                        <DatePicker
                          showYearDropdown
                          placeholder="From"/>
                        <DatePicker
                          showYearDropdown
                          placeholder="To"/>
                      </div>
                      <div className={styles.fourteenthRow}>
                        <div>
                          <Input
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
                      <div className={styles.hr}/>
                      <p className={styles.annotation}>Secondary</p>
                      <div className={styles.thirteenthRow}>
                        <Input
                          value={''}
                          name="* Name of school (Write in full)" />
                        <Input
                          value={''}
                          name="* Basic education / Degree / Course" />
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
                      <div className={styles.hr}/>
                      <p className={styles.annotation}>Vocational / Trade course</p>
                      <div className={styles.thirteenthRow}>
                        <Input
                          value={''}
                          name="* Name of school (Write in full)" />
                        <Input
                          value={''}
                          name="* Basic education / Degree / Course" />
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
                      <div className={styles.hr}/>
                      <p className={styles.annotation}>College</p>
                      <div className={styles.thirteenthRow}>
                        <Input
                          value={''}
                          name="* Name of school (Write in full)" />
                        <Input
                          value={''}
                          name="* Basic education / Degree / Course" />
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
                      <div className={styles.hr}/>
                      <p className={styles.annotation}>Graduate studies</p>
                      <div className={styles.thirteenthRow}>
                        <Input
                          value={''}
                          name="* Name of school (Write in full)" />
                        <Input
                          value={''}
                          name="* Basic education / Degree / Course" />
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
                    </div>
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
