import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import axios from 'axios';
import { Container, Row, Col, setConfiguration } from 'react-grid-system';
import ReactSVG from 'react-svg';
import produce from 'immer';

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import Button from '../../../button/button';
import Select from '../../../select/select';
import Portal from "../../../portal/portal";

import { evaluations } from "../../../../api";

import magnifying from '../../../../assets/ui/magnifying.svg';

setConfiguration({ gutterWidth: 15 });

class Applications extends Component {
  state = {
    hasLoaded: false,

    divisionChief: {
      currentEvaluations: [],
      pastEvaluations: [],
      currentEvaluationId: null
    },

    hrEvaluator: {
      currentEvaluations: [],
      pastEvaluations: []
    },

    showSendModal: false,

    hrEvaluators: [],
    selectedHrEvaluator: null
  };

  componentDidMount = () => {
    //switch between who is looking for applications
    switch(this.props.role) {
      //applicant
      case 4:
        this.divisionChiefFetch();
        break;

      //byClusterEvaluator
      case 5:
        this.hrEvaluatorFetch();
        break;
    }
  };

  onClickEvaluation = id => {
    this.setState(produce(draft => {
      draft.divisionChief.currentEvaluationId = id;
      draft.showSendModal = true;
    }))
  };

  onChangeHrEvaluator = o => {
    this.setState({
      selectedHrEvaluator: o
    })
  };

  onCancelSendToHr = () => {
    this.setState(produce(draft => {
      draft.divisionChief.currentEvaluationId = null;
      draft.selectedHrEvaluator = null;
      draft.showSendModal = false;
    }))
  };

  sendToHr = () => {
    axios.post(evaluations.sendToHrEvaluators, {
      evaluationId: this.state.divisionChief.currentEvaluationId,
      selectedHrEvaluator: this.state.selectedHrEvaluator.value
    })
      .then(() => {
        this.setState(produce(draft => {
          draft.divisionChief.currentEvaluationId = null;

          draft.showSendModal = false;

          draft.selectedHrEvaluator = null
        }), this.divisionChiefFetch)
      })
  };

  divisionChiefFetch = () => {
    axios.get(evaluations.divisionChief)
      .then(res => {
        if(res.data.status === 200) {
          this.setState(produce(draft => {
            draft.divisionChief.currentEvaluations = res.data.current;
            draft.divisionChief.pastEvaluations = res.data.past;

            draft.hasLoaded = true;
          }))
        } else {
          this.setState({hasLoaded: true})
        }

        return axios.get(evaluations.getHrEvaluators)
      })
      .then(res => {
        this.setState({
          hrEvaluators: res.data.data
        })
      })
  };

  hrEvaluatorFetch = () => {
    axios.get(evaluations.hrEvaluator + this.props.employeeId)
      .then(res => {
        console.log(res.data);

        if(res.data.status === 200) {
          this.setState(produce(draft => {
            draft.hrEvaluator.currentEvaluations = res.data.current;
            draft.hrEvaluator.pastEvaluations = res.data.past;

            draft.hasLoaded = true;
          }))
        } else {
          this.setState({hasLoaded: true})
        }
      })
  };

  onClickEvaluationHrEvaluator = id => {
    this.props.history.push(`/evaluations/${id}`)
  };

  render() {
    const evaluationsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Evaluations</p>
      </div>;

    const divisionChiefEvaluations = () => {
      const current = this.state.divisionChief.currentEvaluations.map(evaluation => {

        return (
          <Col key={ evaluation.jobid } xs={2} style={{ marginTop: 15 }}>
            <div
              onClick={() => this.onClickEvaluation(evaluation.id)}
              className={styles.application}>
              <div className={styles.iconContainer}>
                <div className={styles.labelContainer}>
                  <p className={`${ styles.label } ${ styles.green }`}>{ evaluation.count } APPLICANTS</p>
                </div>
                <ReactSVG path={magnifying} svgStyle={{fill: '#4688FF', height: 60}}/>
              </div>
              <div className={styles.bottom}>
                <p>Evaluation for applications for {evaluation.jobtitle}</p>
              </div>
            </div>
          </Col>
        )
      });

      const past = this.state.divisionChief.pastEvaluations.map(evaluation => {

        return (
          <Col key={ evaluation.jobid } xs={2} style={{ marginTop: 15 }}>
            <div
              className={styles.application}>
              <div className={styles.iconContainer}>
                <div className={styles.labelContainer}>
                  <p className={`${ styles.label } ${ styles.green }`}>{ evaluation.count } APPLICANTS</p>
                </div>
                <ReactSVG path={magnifying} svgStyle={{fill: '#4688FF', height: 60}}/>
              </div>
              <div className={styles.bottom}>
                <p>Evaluation for applications for {evaluation.jobtitle}</p>
              </div>
            </div>
          </Col>
        )
      });

      return (
        <Fragment>
          <p className={univStyles.groupLabel}>CURRENT EVALUATIONS</p>
          <div style={{marginTop: 15}}>
            {
              this.state.divisionChief.currentEvaluations.length > 0 ?
                <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                  <Row>
                    { current }
                  </Row>
                </Container> :
                <p style={{margin: 0, textAlign: 'center', fontSize: 14}}>There are no current evaluations yet.</p>
            }
          </div>
          <p className={univStyles.groupLabel}>PAST EVALUATIONS</p>
          <div style={{marginTop: 15}}>
            {
              this.state.divisionChief.pastEvaluations.length > 0 ?
                <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                  <Row>
                    { past }
                  </Row>
                </Container> :
                <p style={{margin: 0, textAlign: 'center', fontSize: 14}}>There are no past evaluations yet.</p>
            }
          </div>
        </Fragment>
      )
    };

    const hrEvaluatorEvaluations = () => {
      const current = this.state.hrEvaluator.currentEvaluations.map(evaluation => {

        return (
          <Col key={ evaluation.jobid } xs={2} style={{ marginTop: 15 }}>
            <div
              onClick={() => this.onClickEvaluationHrEvaluator(evaluation.id)}
              className={styles.application}>
              <div className={styles.iconContainer}>
                <div className={styles.labelContainer}>
                  <p className={`${ styles.label } ${ styles.green }`}>{ evaluation.count } APPLICANTS</p>
                </div>
                <ReactSVG path={magnifying} svgStyle={{fill: '#4688FF', height: 60}}/>
              </div>
              <div className={styles.bottom}>
                <p>Evaluation for applications for {evaluation.jobtitle}</p>
              </div>
            </div>
          </Col>
        )
      });

      const past = this.state.hrEvaluator.pastEvaluations.map(evaluation => {

        return (
          <Col key={ evaluation.jobid } xs={2} style={{ marginTop: 15 }}>
            <div
              onClick={() => this.onClickEvaluationHrEvaluator(evaluation.id)}
              className={styles.application}>
              <div className={styles.iconContainer}>
                <div className={styles.labelContainer}>
                  <p className={`${ styles.label } ${ styles.green }`}>{ evaluation.count } APPLICANTS</p>
                </div>
                <ReactSVG path={magnifying} svgStyle={{fill: '#4688FF', height: 60}}/>
              </div>
              <div className={styles.bottom}>
                <p>Evaluation for applications for {evaluation.jobtitle}</p>
              </div>
            </div>
          </Col>
        )
      });

      return (
        <Fragment>
          <p className={univStyles.groupLabel}>CURRENT EVALUATIONS</p>
          <div style={{marginTop: 15}}>
            {
              this.state.hrEvaluator.currentEvaluations.length > 0 ?
                <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                  <Row>
                    { current }
                  </Row>
                </Container> :
                <p style={{margin: 0, textAlign: 'center', fontSize: 14}}>There are no current evaluations yet.</p>
            }
          </div>
          <p className={univStyles.groupLabel}>PAST EVALUATIONS</p>
          <div style={{marginTop: 15}}>
            {
              this.state.hrEvaluator.pastEvaluations.length > 0 ?
                <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                  <Row>
                    { past }
                  </Row>
                </Container> :
                <p style={{margin: 0, textAlign: 'center', fontSize: 14}}>There are no past evaluations yet.</p>
            }
          </div>
        </Fragment>
      )
    };

    return (
      <Fragment>
        { evaluationsTitleBar }
        {
          this.state.showSendModal ?
            <Portal>
              <div className={styles.sendModal}>
                <div className={styles.form}>
                  <div className={styles.header}>
                    <p>Send this evaluation to HR - Evaluator</p>
                  </div>
                  <div className={styles.formBody}>
                    <div style={{padding: 15, width: 400}}>
                      <Select
                        value={this.state.selectedHrEvaluator}
                        placeholder="Select HR - Evaluator"
                        onChangeHandler={this.onChangeHrEvaluator}
                        options={this.state.hrEvaluators}
                        isClearable />
                    </div>
                    <div className={styles.footer}>
                      <Button
                        onClick={this.onCancelSendToHr}
                        classNames={['cancel']}
                        name="CANCEL"/>
                      <Button
                        disabled={this.state.selectedHrEvaluator === null}
                        onClick={this.sendToHr}
                        classNames={['tertiary']}
                        name="SEND"/>
                    </div>
                  </div>
                </div>
              </div>
            </Portal> :
            null
        }
        <div className={univStyles.main}>
          <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
          <div className={univStyles.pageMain}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>Evaluations</p>
              </div>
              <div className={univStyles.formBody} style={{padding: 15, position: 'relative'}}>
                {
                  this.props.role === 4 ?
                  divisionChiefEvaluations() :
                  hrEvaluatorEvaluations()
                }
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
    role: state.authentication.role,
    employeeId: state.authentication.employeeId
  }
};

export default withRouter(connect(mapStateToProps)(Applications));