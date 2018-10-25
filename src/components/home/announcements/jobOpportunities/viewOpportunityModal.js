import React, {Component} from 'react';
import Truncate from 'react-truncate';
import _ from 'lodash';
import produce from 'immer';
import moment from 'moment';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom';

import styles from './styles.scss';

import check from '../../../../assets/ui/checked.svg';
import warning from '../../../../assets/ui/warning.svg';

import Button from '../../../button/button';

import { applications } from "../../../../api";

class viewOpportunityModal extends Component {
  state = {
    isSalaryGradeQualified: false,
    isEducationQualified: false,
    isEligibilityQualified: false,
    isTrainingQualified: false,
    isExperienceQualified: false,
    currentEligibility: [{
      label: null
    }],
    currentEducation: null,
    currentTrainingHours: 0,
    currentExperienceYears: 0,
    isSubmitDisabled: true,
    reRender: false,
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);

    this.compareSalaryGrade();
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  shouldComponentUpdate = ({}, next) => {
    return next.reRender === true
  };

  handleClickOutside = e => {
    if (this.refs.modal && !this.refs.modal.contains(e.target)) {
      this.props.hideModal();
    }
  };

  compareSalaryGrade = () => {
    const { job } = this.props.data.employeeData;
    const mySalaryGrade = job.salaryGrade;
    const jobSalaryGrade = this.props.data.jobInformation.salarygrade;

    this.setState({isSalaryGradeQualified: (jobSalaryGrade - mySalaryGrade) <= 5}, () => {
      this.compareEducation();
    });

    // const ranges = [[6, 9], [9, 11], [11, 15], [15, 18], [18, 22]];
    //
    // const mySalaryGradeRange = ranges.filter(range => mySalaryGrade >= range[0] && mySalaryGrade <= range[1]);
    // const jobSalaryGradeRange = ranges.find(range => jobSalaryGrade >= range[0] && jobSalaryGrade <= range[1]);
    //
    // const result = mySalaryGradeRange.find(range => range === jobSalaryGradeRange);
    //
    // console.log(!!result)

  };

  compareEducation = () => {
    const { educationalBackground } = this.props.data.employeeData.personalDataSheet;
    const educationQualification  = this.props.data.jobInformation.qualifications.education;

    let currentEducation;

    if(educationalBackground.college.basicEducationDegreeCourse != null) {
      currentEducation = educationalBackground.college.basicEducationDegreeCourse.label
    }

    this.setState({currentEducation});

    switch(educationQualification[0].value) {
      case 29: {
        if(educationalBackground.secondary.periodOfAttendance.from && educationalBackground.secondary.periodOfAttendance.from) {
          this.setState({isEducationQualified: true}, this.compareEligibility)
        }

        break;
      }

      default: {
        if(educationalBackground.college.basicEducationDegreeCourse.label === educationQualification[0].label) {
          this.setState({isEducationQualified: true}, this.compareEligibility)
        }
      }
    }
  };

  compareEligibility = () => {
    const { civilServiceEligibility } = this.props.data.employeeData.personalDataSheet;
    const { eligibility } = this.props.data.jobInformation.qualifications;

    civilServiceEligibility.forEach((e, i) => {
      civilServiceEligibility[i].value = parseInt(civilServiceEligibility[i].value, 10);
    });

    const similar = _.intersectionWith(civilServiceEligibility, eligibility, _.isEqual);

    if(similar.length > 0) {
      this.setState({isEligibilityQualified: true, currentEligibility: similar}, this.compareTraining)
    } else {
      this.compareTraining();
    }
  };

  compareTraining = () => {
    const { trainingsAttended } = this.props.data.employeeData.personalDataSheet;
    const { hoursOfTraining } = this.props.data.jobInformation.qualifications;

    let currentTrainingHours = 0;

    trainingsAttended.forEach(a => {
      currentTrainingHours += a.hours;
    });

    this.setState({
      currentTrainingHours,
      isTrainingQualified: currentTrainingHours >= hoursOfTraining
    }, this.compareYearsOfExperience)
  };

  compareYearsOfExperience = () => {
    const { workExperienceWithinCoa, workExperienceOutsideCoa } = this.props.data.employeeData.personalDataSheet;
    const { yearsOfExperience } = this.props.data.jobInformation.qualifications;
    let days = 0;

    workExperienceOutsideCoa.forEach(e => {
      days += moment(e.to).diff(e.from, 'days');
    });

    workExperienceWithinCoa.forEach((e, i) => {
      //if index is zero (current job, today - e.from)
      if(i === 0) {
        days += moment().diff(e.from, 'days')
      } else {
        days += moment(e.to).diff(e.from, 'days')
      }
    });

    this.setState({
      currentExperienceYears: parseInt((days / 365).toFixed(0), 10),
      isExperienceQualified: parseInt((days / 365).toFixed(0), 10) >= yearsOfExperience
    }, this.checkSubmitButton);
  };

  checkSubmitButton = () => {
    const { isTrainingQualified, isExperienceQualified, isEligibilityQualified, isEducationQualified, isSalaryGradeQualified } = this.state;

    if(isEducationQualified && isTrainingQualified && isExperienceQualified && isEligibilityQualified && isSalaryGradeQualified) {
      this.setState({isSubmitDisabled: false, reRender: true})
    } else {
      this.setState({reRender: true})
    }
  };

  onClickSubmitButton = () => {
    const { employeeId } = this.props.data.employeeData;
    const { jobid, jobOpportunityId } = this.props.data.jobInformation;
    const { evaluatorEmployeeId, officeId } = this.props.data;

    axios.post(applications.create, {
      applicantId: employeeId,
      jobId: jobid,
      jobOpportunityId,
      evaluatorEmployeeId,
      officeId
    })
      .then(res => {
        this.props.history.push('/applications/' + res.data.token)
      })
  };

  render() {
    const { jobInformation } = this.props.data;
    const { personalDataSheet, job } = this.props.data.employeeData;

    return (
      <div className={styles.background}>
        <div ref="modal" className={styles.form} style={{width: 750}}>
          <div className={styles.header}>
            <p>Comparison details</p>
          </div>
          <div className={styles.formBody}>
            <div className={styles.container}>
              <div className={styles.block}>
                <div className={styles.row}>
                  <p className={styles.label}>Current job:</p>
                  <p className={styles.value}>{job.jobTitle}</p>
                </div>
                <div className={styles.row}>
                  <p className={styles.label}>Salary grade:</p>
                  <p className={styles.value}>{job.salaryGrade}</p>
                </div>
                <div className={styles.row}>
                  <p className={styles.label}>Job qualification standards:</p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Education:</p>
                  <p className={styles.value}>
                    <Truncate ellipsis="..." width={220}>
                      {this.state.currentEducation}
                    </Truncate>
                  </p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Eligibility:</p>
                  <p className={styles.value}>{this.state.currentEligibility[0].label}</p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Training:</p>
                  <p className={styles.value}>{this.state.currentTrainingHours} hours of training</p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Experience:</p>
                  <p className={styles.value}>{this.state.currentExperienceYears} years of experience</p>
                </div>
              </div>
              <div className={styles.check}>
                <div className={styles.row}>
                  <p className={styles.value}>&nbsp;</p>
                </div>
                <div className={styles.row} style={{justifyContent: 'center'}}>
                  <p className={styles.value}><img src={(this.state.isSalaryGradeQualified ? check : warning)} height={14} alt=""/></p>
                </div>
                <div className={styles.row}>
                  <p className={styles.value}>&nbsp;</p>
                </div>
                <div className={styles.row} style={{justifyContent: 'center'}}>
                  <p className={styles.value}><img src={(this.state.isEducationQualified ? check : warning)} height={14} alt=""/></p>
                </div>
                <div className={styles.row} style={{justifyContent: 'center'}}>
                  <p className={styles.value}><img src={(this.state.isEligibilityQualified ? check : warning)} height={14} alt=""/></p>
                </div>
                <div className={styles.row} style={{justifyContent: 'center'}}>
                  <p className={styles.value}><img src={(this.state.isTrainingQualified ? check : warning)} height={14} alt=""/></p>
                </div>
                <div className={styles.row} style={{justifyContent: 'center'}}>
                  <p className={styles.value}><img src={(this.state.isExperienceQualified ? check : warning)} height={14} alt=""/></p>
                </div>
              </div>
              <div className={styles.block}>
                <div className={styles.row}>
                  <p className={styles.label}>Position title:</p>
                  <p className={styles.value}>{jobInformation.jobtitle}</p>
                </div>
                <div className={styles.row}>
                  <p className={styles.label}>Salary grade:</p>
                  <p className={styles.value}>{jobInformation.salarygrade}</p>
                </div>
                <div className={styles.row}>
                  <p className={styles.label}>Job qualification standards:</p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Education:</p>
                  <p className={styles.value}>
                    <Truncate ellipsis="..." width={220}>
                      {jobInformation.qualifications.education[0].label}
                    </Truncate>
                  </p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Eligibility:</p>
                  <p className={styles.value}>{jobInformation.qualifications.eligibility[0].label}</p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Training:</p>
                  <p className={styles.value}>{jobInformation.qualifications.hoursOfTraining} hours of training</p>
                </div>
                <div className={styles.row} style={{paddingLeft: 10}}>
                  <p className={styles.label}>Experience:</p>
                  <p className={styles.value}>{jobInformation.qualifications.yearsOfExperience} years of experience</p>
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <p>* On the left side is your current data</p>
              <div>
                <Link to={`/my-files/personal-data-sheet?jobopportunityid=${this.props.match.params.id}&jobid=${this.props.data.jobInformation.jobid}`}>
                  Update PDS
                </Link>
                <span>or</span>
              </div>
              <Button
                onClick={this.onClickSubmitButton}
                disabled={this.state.isSubmitDisabled}
                classNames={['primary']}
                name="SUBMIT AN APPLICATION  →"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(viewOpportunityModal);
