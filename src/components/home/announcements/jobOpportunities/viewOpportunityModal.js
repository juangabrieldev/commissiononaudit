import React, {Component} from 'react';
import Truncate from 'react-truncate';

import styles from './styles.scss';

import check from '../../../../assets/ui/checked.svg';
import warning from '../../../../assets/ui/warning.svg';

import Button from '../../../button/button';

class viewOpportunityModal extends Component {
  state = {
    isSalaryGradeQualified: false,
    isEducationQualified: false,
    isEligibilityQualified: false,
    isTrainingQualified: false,
    isExperienceQualified: false,
    reRender: false,
  };

  componentWillMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);

    this.compareSalaryGrade();
    this.compareEducation();
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
    const mySalaryGrade = job.salarygrade;
    const jobSalaryGrade = this.props.data.jobInformation.salarygrade;

    this.setState({isSalaryGradeQualified: jobSalaryGrade - mySalaryGrade <= 5})

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
    console.log(this.props.data.jobInformation);
    console.log(this.props.data.employeeData)
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
                  <p className={styles.value}>{job.jobtitle}</p>
                </div>
                <div className={styles.row}>
                  <p className={styles.label}>Salary grade:</p>
                  <p className={styles.value}>{job.salarygrade}</p>
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
                <div className={styles.row}>
                  <p className={styles.value}><img src={check} height={14} alt=""/></p>
                </div>
                <div className={styles.row}>
                  <p className={styles.value}><img src={check} height={14} alt=""/></p>
                </div>
                <div className={styles.row}>
                  <p className={styles.value}><img src={check} height={14} alt=""/></p>
                </div>
                <div className={styles.row}>
                  <p className={styles.value}><img src={check} height={14} alt=""/></p>
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
              <Button classNames={['primary']} name="SUBMIT AN APPLICATION  →"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default viewOpportunityModal;
