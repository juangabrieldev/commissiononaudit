import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import produce from 'immer';
import {Col, Container, Row, setConfiguration} from "react-grid-system";
import _ from 'lodash';
import moment from "moment";
import ReactToPrint from "react-to-print";
import fileExtension from 'file-extension';

import { applications, documents, evaluations, jobs } from "../../../../api";

import univStyles from "../../styles.scss";
import styles from "./styles.scss";

import Button from "../../../button/button";
import Checkbox from '../../../checkBox/checkBox';
import Portal from "../../../portal/portal";
import TextArea from '../../../textarea/textArea';

import calendar from '../../../../assets/ui/calendar.svg';
import check from "../../../../assets/ui/check.svg";
import clock from '../../../../assets/ui/clock.svg';
import diploma from '../../../../assets/ui/diploma.svg';
import eligibility from '../../../../assets/ui/eligibility.svg';
import logo from '../../../../assets/logo.png';
import mortarBoard from '../../../../assets/ui/mortarboard.svg';
import next from '../../../../assets/ui/right.svg';
import previous from '../../../../assets/ui/left.svg';

setConfiguration({ gutterWidth: 15 });

class Applicants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [{
        jobtitle: ''
      }],
      evaluationData: [{
        details: {
          files: {}
        },
        personaldatasheet: {
          educationalBackground: {
            college: {
              nameOfSchool: null
            },
            secondary: {
              nameOfSchool: null
            },
            elementary: {
              nameOfSchool: null
            },
            vocational: {
              nameOfSchool: null
            },
            graduateStudies: {
              nameOfSchool: null
            },
          },
          civilServiceEligibility: []
        }
      }],

      jobQualifications: null,
      educationTypes: [],

      hasStartedEvaluation: false,
      evaluationIsDone: false,

      currentNumberOfApplicant: 1,

      showModal: false,
      currentNumberOfDoc: 0,
      documentUrl: null,
      documentName: null,
      documentKeys: [
        'diploma', 'swornStatement', 'workExperience',
        'applicationLetter', 'performanceRatings1', 'performanceRatings2',
        'trainingCertificate', 'workAssignmentHistory', 'positionDescriptionForm',
        'memorandumOfRecommendation'
      ],

      approved: [{}],
      rejected: [{}],
      rankingList: [{
        details: {
          ratings: {
            average: "dasdasd"
          },
        },
        personaldatasheet: {
          workExperienceWithinCoa: [{
            positionTitle: ''
          }]
        }
      }],

      relevantCollege: null,
      relevantWorkInside: [],
      relevantWorkOutside: [],
      relevantTraining: [],

      relevantWorkYearsTotal: 0,
      relevantWorkInsideYears: {
        sentence: '0 years',
        duration: 0
      },
      relevantWorkOutsideYears: {
        sentence: '0 years',
        duration: 0
      },
      relevantTrainingHours: {
        duration: 0
      },

      showRemarksModal: false,
      remarks: [],

      natureOfWork: '',

      height: {
        education: null,
        training: null,
        eligibility: null,
        workExperience: null
      }
    }

    this.rankingListRaw = [];
  }

  componentDidMount = () => {
    axios.get(applications.applicants + `${this.props.employeeId}/${this.props.match.params.jobId}/${this.props.match.params.jobOpportunityId}`)
    .then(res => {
      this.setState(produce(draft => {
        draft.employees = res.data.data.data;
        draft.hasStartedEvaluation = res.data.data.hasStartedEvaluation;
        draft.evaluationIsDone = res.data.data.evaluationIsDone;
      }), () => {
        if(this.state.hasStartedEvaluation || this.state.evaluationIsDone) {
          this.fetchEvaluation(this.props.match.params.jobId, this.props.match.params.jobOpportunityId)
        }
      })
    });

    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleClickOutside = e => {
    if(this.state.currentNumberOfDoc === 0) {
      if (
        ( this.refs.preview && !this.refs.preview.contains(e.target) ) &&
        ( this.refs.next && !this.refs.next.contains(e.target) )
      ) {
        document.body.style.overflow = "visible";

        this.setState({
          showModal: false,
          documentUrl: null
        })
      }
    } else if(this.state.currentNumberOfDoc === 9) {
      if (
        ( this.refs.preview && !this.refs.preview.contains(e.target) ) &&
        ( this.refs.previous && !this.refs.previous.contains(e.target) )
      ) {
        document.body.style.overflow = "visible";

        this.setState({
          showModal: false,
          documentUrl: null
        })
      }
    } else {
      if (
        ( this.refs.previous && !this.refs.previous.contains(e.target) ) &&
        ( this.refs.preview && !this.refs.preview.contains(e.target) ) &&
        ( this.refs.next && !this.refs.next.contains(e.target) )
      ) {
        document.body.style.overflow = "visible";

        this.setState({
          showModal: false,
          documentUrl: null
        })
      }
    }
  };

  startEvaluation = () => {
    axios.post(evaluations.create, {
      jobOpportunityId: this.props.match.params.jobOpportunityId,
      jobId: this.props.match.params.jobId,
    })
      .then(() => {
        this.fetchEvaluation(this.props.match.params.jobId, this.props.match.params.jobOpportunityId)
      })
  };

  fetchEvaluation = (jobId, jobOpportunityId) => {
    let isDone;
    axios.get(evaluations.get + `${jobId}/${jobOpportunityId}`)
      .then(res => {
        this.setState(produce(draft => {
          draft.hasStartedEvaluation = res.data.hasStarted;
          draft.approved = res.data.contenders;
          draft.rankingList = res.data.rankingList;
          draft.rejected = res.data.rejected;
          draft.evaluationData = res.data.data;
        }), () => {
          if(res.data.rankingList.length > 0) {
            isDone = true
          }

          this.fetchJob(jobId);

          this.setState(produce(draft => {
            draft.evaluationIsDone = isDone;
          }))
        })
      })
  };

  setHeight = () => {
    if(!this.state.evaluationIsDone && this.state.jobQualifications) {
      this.setState(produce(draft => {
        //checks if evaluation is already done before setting height
        draft.height.education = this.refs.pdsEducation.clientHeight > this.refs.jobEducation.clientHeight ?
          this.refs.pdsEducation.clientHeight : this.refs.jobEducation.clientHeight;

        draft.height.eligibility = this.refs.pdsEligibility.clientHeight > this.refs.jobEligibility.clientHeight ?
          this.refs.pdsEligibility.clientHeight : this.refs.jobEligibility.clientHeight;

        draft.height.workExperience = this.refs.workExperienceInside.clientHeight + this.refs.workExperienceOutside.clientHeight + 18
      }));
    }
  };

  //fetch the requirements of job
  fetchJob = jobId => {
    axios.get(jobs.view + jobId)
      .then(res => {
        this.setState(produce(draft => {
          draft.jobQualifications = res.data.data.qualifications
        }), () => {
          this.setHeight();
          this.fetchEducationType(jobId)
        })
      })
  };

  fetchEducationType = id => {
    axios.get(jobs.educationType + id)
      .then(res => {
        this.setState({
          educationTypes: res.data.data
        })
      })
  };

  //on previous click on document modal
  onPreviousClick = () => {
    const currentNumberOfDoc = this.state.currentNumberOfDoc - 1;
    const documentName =  _.upperFirst(_.lowerCase(this.state.documentKeys[currentNumberOfDoc]));
    const documentUrl = this.state.evaluationData[this.state.currentNumberOfApplicant - 1].details.files[this.state.documentKeys[currentNumberOfDoc]].localFilePath;

    this.setState({
      documentUrl,
      documentName,
      currentNumberOfDoc
    });
  };

  //on next click on document modal
  onNextClick = () => {
    const currentNumberOfDoc = this.state.currentNumberOfDoc + 1;
    const documentName =  _.upperFirst(_.lowerCase(this.state.documentKeys[currentNumberOfDoc]));
    const documentUrl = this.state.evaluationData[this.state.currentNumberOfApplicant - 1].details.files[this.state.documentKeys[currentNumberOfDoc]].localFilePath;

    this.setState({
      documentUrl,
      documentName,
      currentNumberOfDoc
    });
  };

  onDocumentClick = (url, containerName, i) => {
    this.setState({
      showModal: true,
      documentUrl: url,
      documentName: containerName,
      currentNumberOfDoc: i
    }, () => {
      document.body.style.overflow = "hidden"
    })

    // this.setState({
    //   showModal: this.state.showModal ? null : true
    // })
  };

  saveEvaluation = () => {
    axios.post(evaluations.update, {
      jobId: this.props.match.params.jobId,
      jobOpportunityId: this.props.match.params.jobOpportunityId,
      approved: this.state.approved,
      rejected: this.state.rejected,
      rankingListRaw: this.rankingListRaw,
      remarks: this.state.remarks
    })
      .then(() => {
        this.fetchEvaluation(this.props.match.params.jobId, this.props.match.params.jobOpportunityId)
      })
  };

  onChangeRemarks = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.remarks[this.state.remarks.length - 1] = value
    }))
  };

  onClickRejectCancel = () => {
    this.setState(produce(draft => {
      draft.showRemarksModal = false;
      draft.remarks.pop();
    }), () => console.log(this.state.remarks))
  };

  onClickRejectSave = () => {
    this.setState(produce(draft => {
      draft.rejected.push(this.state.evaluationData[this.state.currentNumberOfApplicant - 1]);
      draft.showRemarksModal = false;
    }), () => {
      window.scrollTo(0, 0);

      if(this.state.currentNumberOfApplicant < this.state.evaluationData.length) {
        this.setState(produce(draft => {
          draft.currentNumberOfApplicant++
        }))
      } else {
        this.saveEvaluation();
      }
    })
  };

  onReject = () => {
    this.setState(produce(draft => {
      draft.showRemarksModal = true;
      draft.remarks.push('');
    }), () => console.log(this.state.remarks))
  };

  onAccept = () => {
    const applicant = { ...this.state.evaluationData[this.state.currentNumberOfApplicant - 1] };

    applicant.relevant = {
      relevantCollege: this.state.relevantCollege,
      relevantWorkInside: this.state.relevantWorkInside,
      relevantWorkOutside: this.state.relevantWorkOutside,
      relevantTraining: this.state.relevantTraining,

      relevantWorkYearsTotal: this.state.relevantWorkYearsTotal,
      relevantWorkInsideYears: this.state.relevantWorkInsideYears,
      relevantWorkOutsideYears: this.state.relevantWorkOutsideYears,
      relevantTrainingHours: this.state.relevantTrainingHours,

      natureOfWork: this.state.natureOfWork
    };

    this.rankingListRaw.push(applicant);

    this.setState(produce(draft => {
      draft.approved.push(this.state.evaluationData[this.state.currentNumberOfApplicant - 1]);
      draft.relevantCollege = null;
      draft.relevantWorkInside = [];
      draft.relevantWorkOutside = [];
      draft.relevantTraining = [];

      draft.relevantWorkYearsTotal = 0;
      draft.relevantWorkInsideYears = {
        sentence: '0 years',
        duration: 0
      };
      draft.relevantWorkOutsideYears = {
        sentence: '0 years',
        duration: 0
      };
      draft.relevantTrainingHours = {
        duration: 0
      };

      draft.natureOfWork = '';
    }), () => {
      window.scrollTo(0, 0);

      if(this.state.currentNumberOfApplicant < this.state.evaluationData.length) {
        this.setState(produce(draft => {
          draft.currentNumberOfApplicant++
        }))
      } else {
        this.saveEvaluation();
      }
    })
  };

  openContext = () => {
    this.openContextBool = true;
    this.forceUpdate();
  };

  computeRelevantWorkInsideYears = () => {
    let momentsFrom = this.state.relevantWorkInside.map(work => moment(work.from));
    momentsFrom = moment.min(momentsFrom);

    let momentsTo = this.state.relevantWorkInside.map(work => {
      if(work.to) {
        return moment(work.to)
      } else {
        return moment();
      }
    });
    momentsTo = moment.max(momentsTo);

    const duration = momentsTo.diff(momentsFrom, 'years');

    const years = momentsTo.diff(momentsFrom, 'year');
    momentsFrom.add(years, 'years');

    const months = momentsTo.diff(momentsFrom, 'months');

    let sentence = `${years > 0 ? years : ''} ${years > 0 ? `year${years > 1 ? 's' : ''}` : ''} ${months > 0 ? `${years > 0 ? 'and' : ''} ${months} month${months > 1 ? 's' : ''}` : ''}`;
    sentence = (sentence === '  ' ? '0 years' : sentence);

    this.setState(produce(draft => {
      draft.relevantWorkInsideYears.duration = duration;
      draft.relevantWorkInsideYears.sentence = sentence
    }), this.computeRelevantWorkYearsTotal);
  };

  computeRelevantWorkOutsideYears = () => {
    let momentsFrom = this.state.relevantWorkOutside.map(work => moment(work.from));
    momentsFrom = moment.min(momentsFrom);

    let momentsTo = this.state.relevantWorkOutside.map(work => {
      if(work.to) {
        return moment(work.to)
      } else {
        return moment();
      }
    });
    momentsTo = moment.max(momentsTo);

    const duration = momentsTo.diff(momentsFrom, 'years');

    const years = momentsTo.diff(momentsFrom, 'year');
    momentsFrom.add(years, 'years');

    const months = momentsTo.diff(momentsFrom, 'months');

    let sentence = `${years > 0 ? years : ''} ${years > 0 ? `year${years > 1 ? 's' : ''}` : ''} ${months > 0 ? `${years > 0 ? 'and' : ''} ${months} month${months > 1 ? 's' : ''}` : ''}`;
    sentence = (sentence === '  ' ? '0 years' : sentence);

    this.setState(produce(draft => {
      draft.relevantWorkOutsideYears.duration = duration;
      draft.relevantWorkOutsideYears.sentence = sentence;
    }), this.computeRelevantWorkYearsTotal);
  };

  computeRelevantWorkYearsTotal = () => {

    this.setState(produce(draft => {
      draft.relevantWorkYearsTotal = this.state.relevantWorkInsideYears.duration + this.state.relevantWorkOutsideYears.duration
    }))
  };

  computeRelevantTrainingYears = () => {
    let hours = 0;

    this.state.relevantTraining.forEach(training => hours += training.hours);

    this.setState(produce(draft => {
      draft.relevantTrainingHours.duration = hours;
    }));
  };

  onClickRelevantCollege = (value, college) => {
    console.log(value, college)
  };

  onClickRelativeWorkInsideCoa = (value, work) => {
    if(value) {
      this.setState(produce(draft => {
        draft.relevantWorkInside.push(work)
      }), this.computeRelevantWorkInsideYears)
    } else {
      //remove the work from relevant work
      this.setState(produce(draft => {
        draft.relevantWorkInside = draft.relevantWorkInside.filter(w => w.positionTitle != work.positionTitle)
      }), this.computeRelevantWorkInsideYears)
    }
  };

  onClickRelativeWorkOutsideCoa = (value, work) => {
    if(value) {
      this.setState(produce(draft => {
        draft.relevantWorkOutside.push(work)
      }), this.computeRelevantWorkOutsideYears)
    } else {
      //remove the work from relevant work
      this.setState(produce(draft => {
        draft.relevantWorkOutside = draft.relevantWorkOutside.filter(w => w.positionTitle != work.positionTitle)
      }), this.computeRelevantWorkOutsideYears)
    }
  };

  onClickRelativeTraining = (value, training) => {
    if(value) {
      this.setState(produce(draft => {
        draft.relevantTraining.push(_.omit(training, ['dataSource']))
      }), this.computeRelevantTrainingYears)
    } else {
      //remove the training from relevant training
      this.setState(produce(draft => {
        draft.relevantTraining = draft.relevantTraining.filter(t => {
          return t.training.value !== training.training.value
        })
      }), this.computeRelevantTrainingYears)
    }
  };

  onChangeNatureOfWork = e => {
    const value = e.target.value;

    this.setState({natureOfWork: value})
  };

  render() {
    const jobsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Application for { this.state.employees[0].jobtitle }</p>
        <p className={univStyles.label}>
          9 applicants
        </p>
        <div onClick={this.openContext} className={styles.generate}>
          <div />
          <div />
          <div />
          {
            this.openContextBool ?
              <div className={styles.context}>
                <ReactToPrint
                  trigger={() => <p href="#">Generate list of applicants</p>}
                  content={() => this.refs.listOfApplicantsReport}
                />
                <ReactToPrint
                  trigger={() => <p href="#">Generate list of qualified and not qualified applicants</p>}
                  content={() => this.refs.listOfQualifiedAndNotQualifiedReport}
                />
                <ReactToPrint
                  trigger={() => <p href="#">Generate ranking list</p>}
                  content={() => this.refs.byClusterEvaluatorRankingListReport}
                  pageStyle="margin: 10px"
                />
              </div> :
              null
          }
        </div>
      </div>;

    const applications = () => {
      if(this.state.evaluationIsDone) {
        return (
          <Fragment>
            {
              this.state.approved.map((employee, i) => {
                return (
                  <div key={i}>
                    <p>{employee.firstname} {employee.middleinitial != null ? employee.middleinitial + '.' : ''} {employee.lastname}</p>
                    <p className={`${styles.status} ${styles.qualified}`}>QUALIFIED</p>
                  </div>
                )
              })
            }
            {
              this.state.rejected.map((employee, i) => {
                return (
                  <div key={i}>
                    <p>{employee.firstname} {employee.middleinitial != null ? employee.middleinitial + '.' : ''} {employee.lastname}</p>
                    <p className={`${styles.status} ${styles.notQualified}`}>NOT QUALIFIED</p>
                  </div>
                )
              })
            }
          </Fragment>
        )
      } else {
        return (
          <Fragment>
            {
              this.state.employees.map((employee, i) => {
                return (
                  <div key={i}>
                    <p>{employee.firstname} {employee.middleinitial != null ? employee.middleinitial + '.' : ''} {employee.lastname}</p>
                  </div>
                )
              })
            }
          </Fragment>
        )
      }
    };

    const bottomBar =
      <div
        className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <p style={{fontSize: 16}}>Applicant {this.state.currentNumberOfApplicant} of {this.state.evaluationData.length}</p>
        <div style={{marginLeft: 'auto', marginRight: 15}}>
          <Button onClick={this.onReject} width={70} classNames={['cancel']} name="REJECT"/>
          <Button style={{marginLeft: 15}} onClick={this.onAccept} width={70} classNames={['primary']} name="ACCEPT"/>
        </div>
      </div>;

    let documentsContainer = [];

    if(this.state.hasStartedEvaluation && this.state.evaluationData != null) {
      const files = this.state.evaluationData[this.state.currentNumberOfApplicant - 1].details.files;

      Object.keys(files).forEach((key, i) => {
        const containerName = _.upperFirst(_.lowerCase(key));

        const con = (
          <Col key={key} xs={2} style={{marginTop: 15}}>
            <div
              onClick={() => this.onDocumentClick(files[key].localFilePath, containerName, i)}
              className={styles.uploadContainer}>
              <div className={styles.iconContainer}>
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center'
                  }}>
                  <p className={styles.fileType + ` ${fileExtension(files[key].localFilePath)}`}>
                    { '.' + fileExtension(files[key].localFilePath) }
                  </p>
                </div>
              </div>
              <div className={styles.bottom}>
                <p>{ containerName }</p>
              </div>
            </div>
          </Col>
        );

        documentsContainer.push(con);
      });
    }

    const evaluationWindow = () => {
      const pdsEducationCollege = evaluation => {
        const course =  evaluation.personaldatasheet.educationalBackground.college.basicEducationDegreeCourse.label;
        const nameOfSchool =  evaluation.personaldatasheet.educationalBackground.college.nameOfSchool;
        const from = moment(evaluation.personaldatasheet.educationalBackground.college.periodOfAttendance.from).format('YYYY');
        const to = moment(evaluation.personaldatasheet.educationalBackground.college.periodOfAttendance.to).format('YYYY');

        const isCustom = this.state.educationTypes.includes(2);

        return (
          <div>
            {
              isCustom ?
                <Checkbox toggle={v => this.onClickRelevantCollege(v, evaluation.personaldatasheet.educationalBackground.college)}/> :
                <img src={mortarBoard} height={20} alt=""/>
            }
            <div>
              <p>
                Studied <strong>{ course }</strong> at <span>{ nameOfSchool }</span>
              </p>
              <p style={{opacity: .8, marginTop: 1}}>({ from } - { to })</p>
            </div>
          </div>
        )
      };

      const pdsEducationSecondary = evaluation => {
        const nameOfSchool =  evaluation.personaldatasheet.educationalBackground.secondary.nameOfSchool;
        const from = moment(evaluation.personaldatasheet.educationalBackground.secondary.periodOfAttendance.from).format('YYYY');
        const to = moment(evaluation.personaldatasheet.educationalBackground.secondary.periodOfAttendance.to).format('YYYY');

        return (
          <div style={{marginLeft: 4}}>
            <img src={diploma} height={16} alt=""/>
            <div>
              <p>
                Went to <span>{ nameOfSchool }</span>
              </p>
              <p style={{opacity: .8, marginTop: 1}}>({ from } - { to })</p>
            </div>
          </div>
        )
      };

      const pdsEducationElementary = evaluation => {
        const nameOfSchool =  evaluation.personaldatasheet.educationalBackground.elementary.nameOfSchool;
        const from = moment(evaluation.personaldatasheet.educationalBackground.elementary.periodOfAttendance.from).format('YYYY');
        const to = moment(evaluation.personaldatasheet.educationalBackground.elementary.periodOfAttendance.to).format('YYYY');

        return (
          <div style={{marginLeft: 4}}>
            <img src={diploma} height={16} alt=""/>
            <div>
              <p>
                Went to <span>{ nameOfSchool }</span>
              </p>
              <p style={{opacity: .8, marginTop: 1}}>({ from } - { to })</p>
            </div>
          </div>
        )
      };

      const pdsWorkExperience = evaluation => {
        const yearsOfExperience = this.state.jobQualifications ? this.state.jobQualifications.yearsOfExperience : 0;
        return (
          <Fragment>
            <div ref="workExperienceInside">
              <p className={styles.annotation}>
                Relevant work experience - Inside Commission on Audit &nbsp;
                <span style={{fontWeight: 400}}>(Check those that apply)</span>
              </p>
              <div
                className={
                  styles.summary + (this.state.relevantWorkYearsTotal >= yearsOfExperience ? ' ' + styles.summaryValid : '')
                }>
                <img src={calendar} alt=""/>
                <p><span>{this.state.relevantWorkInsideYears.sentence}</span> of total relevant work
                  experience inside COA</p>
              </div>
              {
                evaluation.personaldatasheet.workExperienceWithinCoa !== undefined ?
                  evaluation.personaldatasheet.workExperienceWithinCoa.map(w => {
                    return (
                      <div style={{marginLeft: 5}}>
                        <Checkbox toggle={v => this.onClickRelativeWorkInsideCoa(v, w)}/>
                        <div style={{marginLeft: 1}}>
                          <p>
                            <strong>{w.positionTitle}</strong>
                          </p>
                          <p style={{marginTop: 2}}>{w.officeName}</p>
                          <p
                            style={{
                              opacity: .8,
                              marginTop: 2
                            }}>
                            (
                            {
                              moment(w.from).format('MMMM DD, YYYY')
                            } - &nbsp;
                            {
                              w.to !== undefined ?
                                moment(w.to).format('MMMM DD, YYYY') :
                                'Present'
                            }
                            )
                          </p>
                        </div>
                      </div>
                    )
                  }) :
                  null
              }
            </div>
            <div ref="workExperienceOutside">
              <p className={styles.annotation}>
                Relevant work experience - Outside Commission on Audit &nbsp;
                <span style={{fontWeight: 400}}>(Check those that apply)</span>
              </p>
              <div
                className={
                  styles.summary + (this.state.relevantWorkYearsTotal >= yearsOfExperience ? ' ' + styles.summaryValid : '')
                }>
                <img src={calendar} alt=""/>
                <p><span>{this.state.relevantWorkOutsideYears.sentence}</span> of total relevant work
                  experience outside COA</p>
              </div>
              {
                evaluation.personaldatasheet.workExperienceOutsideCoa !== undefined ?
                  evaluation.personaldatasheet.workExperienceOutsideCoa.slice(0).reverse().map(w => {
                    return (
                      <div style={{marginLeft: 5}}>
                        <Checkbox toggle={v => this.onClickRelativeWorkOutsideCoa(v, w)}/>
                        <div style={{marginLeft: 1}}>
                          <p>
                            <strong>{w.positionTitle}</strong>
                          </p>
                          <p style={{marginTop: 2}}>{w.companyName}</p>
                          <p
                            style={{
                              opacity: .8,
                              marginTop: 2
                            }}>
                            (
                            {
                              moment(w.from).format('MMMM DD, YYYY')
                            } - &nbsp;
                            {
                              w.to !== undefined ?
                                moment(w.to).format('MMMM DD, YYYY') :
                                'Present'
                            }
                            )
                          </p>
                        </div>
                      </div>
                    )
                  }) :
                  null
              }
            </div>
          </Fragment>
        )
      };

      const pdsTraining = evaluation => {
        if(this.state.jobQualifications) {
          return (
            <div ref="training">
              <p className={styles.annotation}>
                Relevant training &nbsp;
                <span style={{fontWeight: 400}}>(Check those that apply)</span>
              </p>
              <div
                className={
                  styles.summary +
                  (
                    this.state.relevantTrainingHours.duration >= this.state.jobQualifications.hoursOfTraining ?
                      ' ' + styles.summaryValid :
                      ''
                  )
                }>
                <img src={clock} alt=""/>
                <p>Total of <span>{this.state.relevantTrainingHours.duration}</span> hours relevant training
                </p>
              </div>
              {
                evaluation.personaldatasheet.trainingsAttended !== undefined ?
                  evaluation.personaldatasheet.trainingsAttended.map(t => {
                    return (
                      <div style={{marginLeft: 5}}>
                        <Checkbox toggle={v => this.onClickRelativeTraining(v, t)}/>
                        <div style={{marginLeft: 1}}>
                          <p>
                            <strong>{t.training.label}</strong>
                          </p>
                          <p style={{opacity: .8, marginTop: 1}}>{t.hours} hours</p>
                          <p style={{
                            opacity: .8,
                            marginTop: 1
                          }}>{moment(t.date).format('MMMM DD, YYYY')}</p>
                        </div>
                      </div>
                    )
                  }) :
                  null
              }
            </div>
          )
        }
      };

      const jobEducation = () => {
        if(this.state.jobQualifications) {
          return (
            <div
              ref="jobEducation"
              style={{
                height: this.state.height.education,
              }}>
              <p className={styles.annotation}>Education</p>
              {
                this.state.jobQualifications ?
                  this.state.jobQualifications.education.map(edu => {
                    return (
                      <div>
                        <img src={mortarBoard} height={20} alt=""/>
                        <div>
                          <p>
                            <strong>{ edu.label }</strong>
                          </p>
                        </div>
                      </div>
                    )
                  }) :
                  null
              }
              <div className={styles.dotDotDot}/>
            </div>
          )
        }
      };

      const jobEligibility = () => {
        if(this.state.jobQualifications) {
          const eligibilities = this.state.jobQualifications.eligibility.map(el => {
            return (
              <div style={{marginLeft: 4}}>
                <img src={eligibility} height={18} style={{opacity: 1}} alt=""/>
                <div style={{marginLeft: -4}}>
                  <p>
                    <strong>{ el.label }</strong>
                  </p>
                  <p>&nbsp;</p>
                </div>
              </div>
            )
          });

          return (
            <div
              ref="jobEligibility"
              style={{
                height: this.state.height.eligibility
              }}>
              <p className={styles.annotation}>Eligibility</p>
              { eligibilities }
            </div>
          )
        }
      };

      const jobWorkExperience = () => {
        if(this.state.jobQualifications) {
          return (
            <div
              style={{
                height: this.state.height.workExperience
              }}
            >
              <p className={styles.annotation}>
                Relevant working experience
              </p>
              <div className={styles.summary}>
                <img src={calendar} alt=""/>
                <p><span>{ this.state.jobQualifications.yearsOfExperience }</span> years of relevant experience is required</p>
              </div>
              <div
                style={{
                  height: `calc(100% - 92px)`
                }}
                className={styles.dotDotDot}/>
            </div>
          )
        }
      };

      const jobTraining = () => {
        if(this.state.jobQualifications) {
          return (
            <div>
              <p className={styles.annotation}>
                Relevant training
              </p>
              <div className={styles.summary}>
                <img src={clock} alt=""/>
                <p>Total of <span>{ this.state.jobQualifications.hoursOfTraining }</span> hours is required</p>
              </div>
              <div
                style={{
                  height: `calc(100% - 95px)`
                }}
                className={styles.dotDotDot}/>
            </div>
          )
        }
      };

      return this.state.evaluationData.map((evaluation, i) => {
        if (i === this.state.currentNumberOfApplicant - 1) {
          return (
            <Fragment key={i}>
              {bottomBar}
              <div className={univStyles.main}>
                <div className={univStyles.pageMain}>
                  <div className={univStyles.form} style={{marginBottom: 200}}>
                    <div className={univStyles.header}>
                      <p>
                        Applicant:
                        <span style={{fontWeight: 700}}>
                          {
                            ' ' + evaluation.firstname +
                            (evaluation.middleinitial != null ? ' ' + evaluation.middleinitial + '.' : '') +
                            ' ' + evaluation.lastname
                          }
                        </span>
                      </p>
                    </div>
                    <div className={univStyles.formBody} style={{padding: 15}}>
                      <div className={styles.evaluationContainer}>
                        <p className={styles.annotation}>PDS - JOB REQUIREMENTS COMPARISON</p>
                        <div className={styles.pdsJob}>
                          <div>
                            <div
                              ref="pdsEducation"
                              style={{
                                height: this.state.height.education,
                              }}>
                              <p className={styles.annotation}>Education</p>
                              {
                                evaluation.personaldatasheet.educationalBackground.college.nameOfSchool ?
                                  pdsEducationCollege(evaluation) :
                                  null
                              }
                              {
                                evaluation.personaldatasheet.educationalBackground.secondary.nameOfSchool ?
                                  pdsEducationSecondary(evaluation) :
                                  null
                              }
                              {
                                evaluation.personaldatasheet.educationalBackground.elementary.nameOfSchool ?
                                  pdsEducationElementary(evaluation) :
                                  null
                              }
                              <div className={styles.dotDotDot}/>
                            </div>
                            <div
                              ref="pdsEligibility"
                              style={{
                                height: this.state.height.eligibility
                              }}>
                              <p className={styles.annotation}>Eligibility</p>
                              <div style={{marginLeft: 4}}>
                                <img src={eligibility} height={18} style={{opacity: 1}} alt=""/>
                                <div style={{marginLeft: -4}}>
                                  {
                                    evaluation.personaldatasheet.civilServiceEligibility.length > 0 ?
                                      evaluation.personaldatasheet.civilServiceEligibility.map(c => {
                                        return (
                                          <p>
                                            <strong>{c.label}</strong>
                                          </p>
                                        )
                                      }) :
                                      <p>
                                        No available Civil Service eligibility
                                      </p>
                                  }
                                  <p>&nbsp;</p>
                                </div>
                              </div>
                            </div>
                            { pdsWorkExperience(evaluation) }
                            { pdsTraining(evaluation) }
                          </div>
                          <div>
                            { jobEducation() }
                            { jobEligibility() }
                            { jobWorkExperience() }
                            { jobTraining() }
                          </div>
                        </div>
                        <p className={styles.annotation}>DOCUMENTS</p>
                        <Container fluid style={{padding: 0, marginTop: '-7px'}}>
                          <Row>
                            {documentsContainer}
                          </Row>
                        </Container>
                        <p className={styles.annotation}>NATURE OF WORK</p>
                        <div style={{marginTop: 12}}>
                          <TextArea
                            onChangeHandler={this.onChangeNatureOfWork}
                            value={this.state.natureOfWork}
                            name="Nature of work"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )
        } else return null
      })
    };

    const documentsModal = () => {
      const url = `${localStorage.getItem('ngrokUrl')}documents/${this.state.documentUrl}`;

      return (
        <div className={styles.modal}>
          <div>
            {
              this.state.currentNumberOfDoc > 0 ?
                <div onClick={this.onPreviousClick} className={styles.navigation} ref="previous">
                  <img src={previous} height={30} alt=""/>
                </div> :
                null
            }
          </div>
          <div className={styles.preview} ref="preview">
            <div className={styles.documentName}>
              <p>{ this.state.documentName }</p>
              <p>{ this.state.evaluationData[this.state.currentNumberOfApplicant - 1].details.files[this.state.documentKeys[this.state.currentNumberOfDoc]].localFilePath }</p>
            </div>
            {
              this.state.documentUrl != null ?
                fileExtension(url) === 'jpg' ?
                  <div className={styles.imagePreview}>
                    <img src={url} alt=""/>
                  </div> :
                  <iframe
                    src={'https://view.officeapps.live.com/op/embed.aspx?src=' + url}
                    width='100%' height='100%' style={{boxSizing: 'border-box'}} frameBorder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft
                    Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
                  </iframe>
                :
                null
            }
          </div>
          <div>
            {
              this.state.currentNumberOfDoc < this.state.documentKeys.length - 1 ?
                <div onClick={this.onNextClick} className={styles.navigation} ref="next">
                  <img src={next} height={30} alt=""/>
                </div> :
                null
            }
          </div>
        </div>
      )
    };

    const remarksModal = () => {
      return (
        <div className={styles.remarksModal}>
          <div className={styles.form}>
            <div className={styles.header}>
              <p>Are you sure you want to dismiss this applicant?</p>
            </div>
            <div className={styles.formBody} style={{width: 600}}>
              <div style={{padding: 15}}>
                <TextArea
                  value={this.state.remarks[this.state.remarks.length - 1]}
                  autoFocus
                  name="Remarks"
                  onChangeHandler={this.onChangeRemarks} />
              </div>
              <div className={styles.footer}>
                <Button onClick={this.onClickRejectCancel} name="CANCEL" classNames={['cancel']}/>
                <Button onClick={this.onClickRejectSave} name="PROCEED" classNames={['tertiary']}/>
              </div>
            </div>
          </div>
        </div>
      )
    };

    const listOfApplicantsReportRow = this.state.employees.map(emp => {
      return (
        <tr>
          <td>{ emp.employeeid }</td>
          <td>
            {
              ' ' + emp.firstname +
              ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
              ' ' + emp.lastname
            }
          </td>
          <td>Accountant II</td>
          <td>Administration Sector</td>
          <td>{ moment(emp.dateofsubmission).format('dddd, MMMM D YYYY') }</td>
        </tr>
      )
    });

    const listOfApplicantsReport = (
      <div ref="listOfApplicantsReport"  style={{
        backgroundColor: '#fff',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        boxSizing: 'border-box'
      }}>
        <p style={{marginBottom: 4, textAlign: 'right'}}>{ moment().format('MMMM DD, YYYY') }</p>
        <div style={{width: '100%', height: 1, backgroundColor: 'rgb(230, 230, 230)'}}/>
        <div style={{marginTop: 20, display: 'flex', alignItems: 'center', marginBottom: 40}}>
          <img src={logo} height={60} alt=""/>
          <div style={{marginLeft: 10}}>
            <p style={{fontFamily: 'Cinzel', fontSize: 24, margin: 0}}>Commission on Audit</p>
            <p style={{fontFamily: 'Segoe UI', fontSize: 16, margin: 0}}>PROMOTION MANAGEMENT SYSTEM</p>
          </div>
        </div>
        <p style={{fontSize: 20, fontWeight: 600, textAlign: 'center'}}>LIST OF APPLICANTS APPLYING FOR { this.state.employees[0].jobtitle.toUpperCase() }</p>
        <p>Total number of applicants: { this.state.employees.length }</p>
        <table style={{width: '100%'}} className={styles.demo}>
          <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Current position</th>
            <th>Current office</th>
            <th>Date of submission</th>
          </tr>
          </thead>
          <tbody>
          { listOfApplicantsReportRow }
          </tbody>
        </table>
      </div>
    );

    const listOfQualifiedAndNotQualifiedReportRow1 = this.state.approved.map(emp => {
      return (
        <tr>
          <td>{ emp.applicantid }</td>
          <td>
            {
              ' ' + emp.firstname +
              ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
              ' ' + emp.lastname
            }
          </td>
          <td>Accountant II</td>
          <td>Administration Sector</td>
          <td>{ moment(emp.dateofsubmission).format('dddd, MMMM D YYYY') }</td>
          <td>Qualified</td>
        </tr>
      )
    });

    const listOfQualifiedAndNotQualifiedReportRow2 = this.state.rejected.map(emp => {
      return (
        <tr>
          <td>{ emp.applicantid }</td>
          <td>
            {
              ' ' + emp.firstname +
              ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
              ' ' + emp.lastname
            }
          </td>
          <td>Accountant II</td>
          <td>Administration Sector</td>
          <td>{ moment(emp.dateofsubmission).format('dddd, MMMM D YYYY') }</td>
          <td>Not qualified</td>
        </tr>
      )
    });

    const listOfQualifiedAndNotQualifiedReport = (
      <div ref="listOfQualifiedAndNotQualifiedReport"  style={{
        backgroundColor: '#fff',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        boxSizing: 'border-box'
      }}>
        <p style={{marginBottom: 4, textAlign: 'right'}}>{ moment().format('MMMM DD, YYYY') }</p>
        <div style={{width: '100%', height: 1, backgroundColor: 'rgb(230, 230, 230)'}}/>
        <div style={{marginTop: 20, display: 'flex', alignItems: 'center', marginBottom: 40}}>
          <img src={logo} height={60} alt=""/>
          <div style={{marginLeft: 10}}>
            <p style={{fontFamily: 'Cinzel', fontSize: 24, margin: 0}}>Commission on Audit</p>
            <p style={{fontFamily: 'Segoe UI', fontSize: 16, margin: 0}}>PROMOTION MANAGEMENT SYSTEM</p>
          </div>
        </div>
        <p style={{fontSize: 20, fontWeight: 600, textAlign: 'center'}}>
          LIST OF QUALIFIED / NOT QUALIFIED APPLICANTS APPLYING FOR { this.state.employees[0].jobtitle.toUpperCase() }
        </p>
        <p>Total number of applicants: { this.state.employees.length }</p>
        <p>Total number of qualified applicants: { this.state.approved.length }</p>
        <p>Total number of not qualified applicants: { this.state.rejected.length }</p>
        <table className={styles.demo}>
          <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Current position</th>
            <th>Current office</th>
            <th>Date of submission</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          { listOfQualifiedAndNotQualifiedReportRow1 }
          { listOfQualifiedAndNotQualifiedReportRow2 }
          </tbody>
        </table>
      </div>
    );

    const byClusterEvaluatorRankingListRow = this.state.rankingList.map((emp, i) => {
      return (
        <tr>
          <td>
            <strong>
              {
                ' ' + emp.firstname +
                ( emp.middleinitial != null ? ' ' + emp.middleinitial + '.' : '' ) +
                ' ' + emp.lastname
              }
            </strong>
          </td>
          <td>&nbsp;</td>
          <td>{ emp.personaldatasheet.workExperienceWithinCoa[0].positionTitle }</td>
          <td>{ this.state.employees[0].jobtitle }</td>
          <td style={{padding: 0}}>

          </td>
          <td><strong>RA 1080 (CPA)</strong></td>
          <td></td>
          <td style={{padding: 0}}>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <p>{ emp.details.ratings.first }</p>
              <p>{ emp.details.ratings.second }</p>
              {/*<p>{ emp.details.ratings.average.substring(0, 4) }</p>*/}
            </div>
          </td>
          <td>&nbsp;</td>
          <td>{ i + 1 }</td>
        </tr>
      )
    });

    const byClusterEvaluatorRankingListReport = (
      <div ref="byClusterEvaluatorRankingListReport"  style={{
        backgroundColor: '#fff',
        padding: 20,
        boxSizing: 'border-box'
      }}>
        <p style={{fontSize: 16, fontWeight: 600, textAlign: 'center'}}>
          PROPOSAL FOR PROMOTION / RANKING LIST OF CONTENDERS
          <br/>
          as of { moment().format('MMMM DD, YYYY') }
        </p>
        <table className={styles.demo}>
          {/*<tbody>*/}
          {/*{ rankingListReportRow }*/}
          {/*</tbody>*/}
          <tbody>
            <tr>
              <td colSpan={2}>
                &nbsp;
              </td>
              <td colSpan={8}>
                Qualification Standards
              </td>
            </tr>
            <tr>
              <td>Recommending office / Sector</td>
              <td><strong>Administration Sector</strong></td>
              <td colSpan={8}>&nbsp;</td>
            </tr>
            <tr>
              <td>Proposed position :</td>
              <td><strong>{ this.state.employees[0].jobtitle }</strong></td>
              <td>Education</td>
              <td colSpan={11}><strong>Bachelor of Science in Accountancy</strong></td>
            </tr>
            <tr>
              <td>Number of contenders</td>
              <td><strong>{ this.state.approved.length }</strong></td>
              <td>Experience</td>
              <td colSpan={11}><strong>2 years of relevant experience</strong></td>
            </tr>
            <tr>
              <td>Number of vacancies</td>
              <td><strong>{ 3 }</strong></td>
              <td>Training</td>
              <td colSpan={11}><strong>8 hours of relevant training</strong></td>
            </tr>
            <tr>
              <td>Data of publication of vacancies <br/> in the CSC website</td>
              <td>&nbsp;</td>
              <td>Eligibility</td>
              <td colSpan={11}><strong>RA 1080 (CPA)</strong></td>
            </tr>
            <tr>
              <td colSpan={7}>Contenders' Profile</td>
              <td colSpan={3}>Ranking list</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>Date of birth</td>
              <td>Present position / <br/> SG / Place of assignment</td>
              <td>Proposed <br/>place of assignment</td>
              <td style={{padding: 0}}>
                <table style={{borderSpacing: 0}}>
                  <tr>
                    <td style={{
                      border: 'none',
                      borderBottom: 'solid 1px #C0C0C0'
                    }}
                        colSpan={2}>
                      Educational attainment
                    </td>
                  </tr>
                  <tr>
                    <td style={{border: 'none', borderRight: 'solid 1px #C0C0C0'}}>
                      Basic / Honors
                    </td>
                    <td style={{border: 'none'}}>
                      Master's / Honors
                    </td>
                  </tr>
                </table>
              </td>
              <td>Eligibility</td>
              <td style={{padding: 0}}>
                <table style={{borderSpacing: 0}}>
                  <tr>
                    <td style={{
                      border: 'none',
                      borderBottom: 'solid 1px #C0C0C0'
                    }}
                        colSpan={2}>
                      Relevant training
                    </td>
                  </tr>
                  <tr>
                    <td style={{border: 'none', borderRight: 'solid 1px #C0C0C0'}}>
                      Title <br/> of training
                    </td>
                    <td style={{border: 'none'}}>
                      No. of hours
                    </td>
                  </tr>
                </table>
              </td>
              <td style={{padding: 0}}>
                <table style={{borderSpacing: 0, borderCollapse: 'collapse'}}>
                  <tr>
                    <td style={{
                      border: 'none',
                      borderBottom: 'solid 1px #C0C0C0'
                    }}
                        colSpan={3}>
                      Performance
                    </td>
                  </tr>
                  <tr>
                    <td style={{border: 'none', borderRight: 'solid 1px #C0C0C0'}}>
                      1st <br/> sem. June
                    </td>
                    <td style={{border: 'none', borderRight: 'solid 1px #C0C0C0'}}>
                      2nd <br/> sem. Dec
                    </td>
                    <td style={{border: 'none'}}>
                      Average
                    </td>
                  </tr>
                </table>
              </td>
              <td style={{padding: 0}}>
                <table style={{borderSpacing: 0, borderCollapse: 'collapse'}}>
                  <tr>
                    <td style={{
                      border: 'none',
                      borderBottom: 'solid 1px #C0C0C0'
                    }}
                        colSpan={2}>
                      Tie breaker
                    </td>
                  </tr>
                  <tr>
                    <td style={{border: 'none', borderRight: 'solid 1px #C0C0C0'}}>
                      Merit
                    </td>
                    <td style={{border: 'none', borderRight: 'solid 1px #C0C0C0'}}>
                      Length of <br/> service
                    </td>
                  </tr>
                </table>
              </td>
              <td>Rank</td>
            </tr>
            { byClusterEvaluatorRankingListRow }
          </tbody>
        </table>
      </div>
    );

    return (
      <Fragment>
        {
          this.state.showModal ?
            <Portal>
              { documentsModal() }
            </Portal> :
            null
        }
        {
          this.state.showRemarksModal ?
            <Portal>
              { remarksModal() }
            </Portal> :
            null
        }
        { jobsTitleBar }
        <Portal>
          <div style={{position: 'absolute', display: 'none', left: 0}}>
            { listOfApplicantsReport }
            { listOfQualifiedAndNotQualifiedReport }
            { byClusterEvaluatorRankingListReport }
          </div>
        </Portal>
        {
          this.state.hasStartedEvaluation && !this.state.evaluationIsDone ?
            evaluationWindow() :
            <div className={univStyles.main}>
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>List of applicants</p>
                    <div className={styles.startEvaluationContainer}>
                      {
                        !this.state.evaluationIsDone ?
                          <Button
                            onClick={this.startEvaluation}
                            classNames={['primary']}
                            name="START EVALUATION" /> :
                          null
                      }
                      <div>

                      </div>
                    </div>
                  </div>
                  <div className={univStyles.formBody} style={{padding: 15}}>
                    <div className={styles.applicantsContainer}>
                      { applications() }
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
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

export default withRouter(connect(mapStateToProps)(Applicants));

