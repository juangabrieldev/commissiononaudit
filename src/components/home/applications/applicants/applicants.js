import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import produce from 'immer';
import {Container, Row, Col, setConfiguration} from "react-grid-system";
import _ from 'lodash';
import moment from "moment";
import ReactToPrint from "react-to-print";

import { applications, evaluations, documents } from "../../../../api";

import univStyles from "../../styles.scss";
import styles from "./styles.scss";

import Button from "../../../button/button";
import Checkbox from '../../../checkBox/checkBox';
import Portal from "../../../portal/portal";

import calendar from '../../../../assets/ui/calendar.svg';
import check from "../../../../assets/ui/check.svg";
import clock from '../../../../assets/ui/clock.svg';
import diploma from '../../../../assets/ui/diploma.svg';
import eligibility from '../../../../assets/ui/eligibility.svg';
import logo from '../../../../assets/logo.png';
import mortarBoard from '../../../../assets/ui/mortarboard.svg';

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

      hasStartedEvaluation: false,
      evaluationIsDone: false,

      currentNumberOfApplicant: 1,

      showModal: false,
      currentNumberOfDoc: 0,
      documentUrl: null,

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

      height: {
        education: null,
        training: null,
        eligibility: null,
        workExperience: null
      }
    }
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
    if (this.refs.preview && !this.refs.preview.contains(e.target)) {
      document.body.style.overflow = "visible";

      this.setState({
        showModal: false,
        documentUrl: null
      })
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

          isDone = res.data.isDone;
        }), () => {
          this.setState(produce(draft => {
            draft.evaluationIsDone = isDone;
          }), () => {
            this.setState(produce(draft => {
              draft.height.education = this.refs.pdsEducation.clientHeight > this.refs.jobEducation.clientHeight ?
                this.refs.pdsEducation.clientHeight : this.refs.jobEducation.clientHeight;

              draft.height.eligibility = this.refs.pdsEligibility.clientHeight > this.refs.jobEligibility.clientHeight ?
                this.refs.pdsEligibility.clientHeight : this.refs.jobEligibility.clientHeight;

              draft.height.workExperience = this.refs.workExperienceInside.clientHeight + this.refs.workExperienceOutside.clientHeight + 18
            }))
          });
        })
      })
  };

  onDocumentClick = (url) => {
    this.setState({showModal: true}, () => {
      axios.get(documents.get + url.replace('https://anonfile.com/', ''))
        .then(res => {
          document.body.style.overflow = "hidden";

          this.setState({
            documentUrl: res.data.remoteUrl
          })
        })
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
      rejected: this.state.rejected
    })
      .then(() => {
        this.fetchEvaluation(this.props.match.params.jobId, this.props.match.params.jobOpportunityId)
      })
  };

  onReject = () => {
    this.setState(produce(draft => {
      draft.rejected.push(this.state.evaluationData[this.state.currentNumberOfApplicant - 1]);
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

  onAccept = () => {
    this.setState(produce(draft => {
      draft.approved.push(this.state.evaluationData[this.state.currentNumberOfApplicant - 1]);
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

  onCheckRelativeExperience = i => {

  };

  render() {
    console.log(this.state.evaluationData);

    const jobsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Application for { this.state.employees[0].jobtitle }</p>
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

    const applications = this.state.employees.map((employee, i) => {
      return (
        <div key={i}>
          <p>{employee.firstname} {employee.middleinitial != null ? employee.middleinitial + '.' : ''} {employee.lastname}</p>
        </div>
      )
    });

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

      Object.keys(files).forEach(key => {
        const containerName = _.upperFirst(_.lowerCase(key));

        const con = (
          <Col key={key} xs={2} style={{marginTop: 15}}>
            <div
              onClick={() => this.onDocumentClick(files[key].remoteFilePath)}
              className={styles.uploadContainer}>
              <div className={styles.iconContainer}>
                <div className={styles.validity}>
                  <img src={check} height={16} alt=""/>
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
      const e = this.state.evaluationData.map((evaluation, i) => {
        if(i === this.state.currentNumberOfApplicant - 1) {
          return (
            <Fragment key={i}>
              { bottomBar }
              <div className={univStyles.main}>
                <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
                <div className={univStyles.pageMain}>
                  <div className={univStyles.form} style={{marginBottom: 200}}>
                    <div className={univStyles.header}>
                      <p>
                        Applicant:
                        <span style={{fontWeight: 700}}>
                          {
                            ' ' + evaluation.firstname +
                            ( evaluation.middleinitial != null ? ' ' + evaluation.middleinitial + '.' : '' ) +
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
                                height: this.state.height.education
                              }}>
                              <p className={styles.annotation}>Education</p>
                              {
                                evaluation.personaldatasheet.educationalBackground.college.nameOfSchool ?
                                  <div>
                                    <img src={mortarBoard} height={20} alt=""/>
                                    <div>
                                      <p>
                                        Studied <strong>Bachelor of Science in Accountancy</strong> at <span>Polytechnic University of the Philippines</span>
                                      </p>
                                      <p style={{opacity: .8, marginTop: 1}}>(2015 - 2019)</p>
                                    </div>
                                  </div> :
                                  null
                              }
                              {
                                evaluation.personaldatasheet.educationalBackground.secondary.nameOfSchool ?
                                  <div style={{marginLeft: 4}}>
                                    <img src={diploma} height={16} alt=""/>
                                    <div>
                                      <p>
                                        Went to <span>Ramon Magsaysay High School</span>
                                      </p>
                                      <p style={{opacity: .8, marginTop: 1}}>(2011 - 2015)</p>
                                    </div>
                                  </div> :
                                  null
                              }
                              {
                                evaluation.personaldatasheet.educationalBackground.elementary.nameOfSchool ?
                                  <div style={{marginLeft: 4}}>
                                    <img src={diploma} height={16} alt=""/>
                                    <div>
                                      <p>
                                        Went to <span>Moises Salvador Elementary School</span>
                                      </p>
                                      <p style={{opacity: .8, marginTop: 1}}>(2006 - 2006)</p>
                                    </div>
                                  </div> :
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
                                            <strong>{ c.label }</strong>
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
                            <div ref="workExperienceInside">
                              <p className={styles.annotation}>
                                Relevant work experience - Inside Commission on Audit &nbsp;
                                <span style={{fontWeight: 400}}>(Check those that apply)</span>
                              </p>
                              <div className={styles.summary}>
                                <img src={calendar} alt=""/>
                                <p><span>3</span> years of total relevant work experience inside COA</p>
                              </div>
                              {
                                evaluation.personaldatasheet.workExperienceWithinCoa != undefined ?
                                  evaluation.personaldatasheet.workExperienceWithinCoa.map(w => {
                                    return (
                                      <div style={{marginLeft: 5}}>
                                        <Checkbox toggle={() => {}}/>
                                        <div style={{marginLeft: 1}}>
                                          <p>
                                            <strong>{ w.positionTitle }</strong>
                                          </p>
                                          <p style={{marginTop: 2}}>{ w.officeName }</p>
                                          <p
                                            style={{
                                              opacity: .8,
                                              marginTop: 2
                                            }}>
                                            (
                                              {
                                                moment(w.from).format('YYYY')
                                              } - &nbsp;
                                              {
                                                w.to != undefined ?
                                                  moment(w.to).format('YYYY') :
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
                              <div className={styles.summary}>
                                <img src={calendar} alt=""/>
                                <p><span>3</span> years of total relevant work experience outside COA</p>
                              </div>
                              {
                                evaluation.personaldatasheet.workExperienceOutsideCoa != undefined ?
                                  evaluation.personaldatasheet.workExperienceOutsideCoa.slice(0).reverse().map(w => {
                                    return (
                                      <div style={{marginLeft: 5}}>
                                        <Checkbox toggle={() => {}}/>
                                        <div style={{marginLeft: 1}}>
                                          <p>
                                            <strong>{ w.positionTitle }</strong>
                                          </p>
                                          <p style={{marginTop: 2}}>{ w.companyName }</p>
                                          <p
                                            style={{
                                              opacity: .8,
                                              marginTop: 2
                                            }}>
                                            (
                                            {
                                              moment(w.from).format('YYYY')
                                            } - &nbsp;
                                            {
                                              w.to != undefined ?
                                                moment(w.to).format('YYYY') :
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
                            <div ref="training">
                              <p className={styles.annotation}>
                                Relevant training &nbsp;
                                <span style={{fontWeight: 400}}>(Check those that apply)</span>
                              </p>
                              <div className={styles.summary}>
                                <img src={clock} alt=""/>
                                <p>Total of <span>8</span> hours relevant training</p>
                              </div>
                              {
                                evaluation.personaldatasheet.trainingsAttended != undefined ?
                                  evaluation.personaldatasheet.trainingsAttended.map(t => {
                                    return (
                                      <div style={{marginLeft: 5}}>
                                        <Checkbox toggle={() => {}}/>
                                        <div style={{marginLeft: 1}}>
                                          <p>
                                            <strong>{ t.training.label }</strong>
                                          </p>
                                          <p style={{opacity: .8, marginTop: 1}}>{ t.hours } hours</p>
                                          <p style={{opacity: .8, marginTop: 1}}>{ moment(t.date).format('MMMM DD, YYYY') }</p>
                                        </div>
                                      </div>
                                    )
                                  }) :
                                  null
                              }
                            </div>
                          </div>
                          <div>
                            <div
                              ref="jobEducation"
                              style={{
                                height: this.state.height.education,
                              }}>
                              <p className={styles.annotation}>Education</p>
                              <div>
                                <img src={mortarBoard} height={20} alt=""/>
                                <div>
                                  <p>
                                    <strong>Bachelor of Science in Accountancy</strong>
                                  </p>
                                </div>
                              </div>
                              <div className={styles.dotDotDot}/>
                            </div>
                            <div
                              ref="jobEligibility"
                              style={{
                                height: this.state.height.eligibility
                              }}>
                              <p className={styles.annotation}>Eligibility</p>
                              <div style={{marginLeft: 4}}>
                                <img src={eligibility} height={18} style={{opacity: 1}} alt=""/>
                                <div style={{marginLeft: -4}}>
                                  <p>
                                    <strong>RA 1080 (CPA)</strong>
                                  </p>
                                  <p>&nbsp;</p>
                                </div>
                              </div>
                            </div>
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
                                <p><span>3</span> years of relevant experience is required</p>
                              </div>
                              <div
                                style={{
                                  height: `calc(100% - 92px)`
                                }}
                                className={styles.dotDotDot}/>
                            </div>
                            <div>
                              <p className={styles.annotation}>
                                Relevant training
                              </p>
                              <div className={styles.summary}>
                                <img src={clock} alt=""/>
                                <p>Total of <span>8</span> hours is required</p>
                              </div>
                              <div
                                style={{
                                  height: `calc(100% - 95px)`
                                }}
                                className={styles.dotDotDot}/>
                            </div>
                          </div>
                        </div>
                        <p className={styles.annotation}>DOCUMENTS</p>
                        <Container fluid style={{padding: 0, marginTop: '-7px'}}>
                          <Row>
                            { documentsContainer }
                          </Row>
                        </Container>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )
        } else return null
      });

      return e
    };

    const documentsModal = (
      <div className={styles.modal}>
        <div>
          PREVIOUS
        </div>
        <div className={styles.preview} ref="preview">
          {
            this.state.documentUrl != null ?
              <iframe
                src={'https://view.officeapps.live.com/op/embed.aspx?src=' + this.state.documentUrl}
                width='100%' height='100%' style={{boxSizing: 'border-box'}} frameBorder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft
                Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
              </iframe> :
              null
          }
        </div>
        <div>
          NEXT
        </div>
      </div>
    );

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
              { documentsModal }
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
                      { applications }
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

