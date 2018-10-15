import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import { Container, Row, Col, setConfiguration } from 'react-grid-system';
import axios from 'axios';
import produce from 'immer';
import readExcel from 'read-excel-file';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import moment from "moment";

import univStyles from '../../styles.scss'
import styles from './styles.scss';

import { evaluations } from "../../../../api";

import check from '../../../../assets/ui/check.svg';
import Button from "../../../button/button";
// import Modal from './modal';
import Portal from '../../../portal/portal';

setConfiguration({ gutterWidth: 15 });

class ViewEvaluation extends Component {
  state = {
    jobTitle: null,
    isEvaluationDone: false,
    rankingListDrag: [],
  };

  componentDidMount = () => {
    this.fetch()
  };

  fetch = () => {
    const { id } = this.props.match.params;

    axios.get(evaluations.hrEvaluatorView + `${id}/${this.props.employeeId}`)
      .then(res => {
        this.setState(produce(draft => {
          draft.jobTitle = res.data.data[0].jobtitle
        }));
      })
  };

  // componentDidMount = () => {
  //   this.fetch();
  // };
  //
  // onChangeUploadContainer = i => {
  //   const notValid = () => {
  //     alert('Please upload a valid Performance sheet.');
  //
  //     this.refs[this.state.uploadContainers[i].name].value = null;
  //
  //     this.setState(produce(draft => {
  //       draft.uploadContainers[i].isValid = false
  //     }));
  //   };
  //
  //   if(this.refs[this.state.uploadContainers[i].name].value) {
  //     const fileName = this.refs[this.state.uploadContainers[i].name].files[0].name;
  //     const fileSize = this.refs[this.state.uploadContainers[i].name].files[0].size;
  //
  //     if(i === 3 || i === 4) {
  //       readExcel(this.refs[this.state.uploadContainers[i].name].files[0])
  //         .then(rows => {
  //           const index = _.findIndex(rows, o => {
  //             return o[0] === 'Final Rating:'
  //           });
  //
  //           if(index < 0) {
  //             notValid();
  //           } else {
  //             //if out of range
  //             if(rows[index][1] <= 5 && rows[index][1] >= 0) {
  //               const first = this.refs[this.state.uploadContainers[3].name].files[0];
  //               const second = this.refs[this.state.uploadContainers[4].name].files[0];
  //
  //               if(first && second) {
  //                 if(first.lastModified === second.lastModified) {
  //                   notValid()
  //                 } else {
  //                   this.setState(produce(draft => {
  //                     //switch between performance ratings
  //                     switch(i) {
  //                       case 3: {
  //                         draft.ratings.first = rows[index][1];
  //                         break;
  //                       }
  //
  //                       case 4: {
  //                         draft.ratings.second = rows[index][1];
  //                       }
  //                     }
  //
  //                     draft.uploadContainers[i].isValid = true;
  //                     draft.uploadContainers[i].fileName = fileName;
  //                     draft.uploadContainers[i].fileSize = fileSize;
  //                   }));
  //                 }
  //               } else {
  //                 this.setState(produce(draft => {
  //                   //switch between performance ratings
  //                   switch(i) {
  //                     case 3: {
  //                       draft.ratings.first = rows[index][1];
  //                       break;
  //                     }
  //
  //                     case 4: {
  //                       draft.ratings.second = rows[index][1];
  //                     }
  //                   }
  //
  //                   draft.uploadContainers[i].isValid = true;
  //                   draft.uploadContainers[i].fileName = fileName;
  //                   draft.uploadContainers[i].fileSize = fileSize;
  //                 }));
  //               }
  //             } else {
  //               notValid()
  //             }
  //           }
  //         })
  //         .catch(notValid)
  //     } else {
  //       this.setState(produce(draft => {
  //         draft.uploadContainers[i].isValid = true;
  //         draft.uploadContainers[i].fileName = fileName;
  //         draft.uploadContainers[i].fileSize = fileSize;
  //       }));
  //     }
  //   } else {
  //     this.setState(produce(draft => {
  //       draft.uploadContainers[i].isValid = false;
  //       draft.uploadContainers[i].fileName = null;
  //       draft.uploadContainers[i].fileSize = null;
  //     }));
  //   }
  // };
  //
  // onNext = () => {
  //   if(this.state.currentPage === 1) {
  //     const files = new FormData();
  //
  //     this.state.uploadContainers.forEach(con => {
  //       const name = _.camelCase(con.name);
  //
  //       files.append(name, this.refs[con.name].files[0]);
  //     });
  //
  //     files.append('applicationId', this.props.match.params.token);
  //     files.append('firstRating', this.state.ratings.first.toString());
  //     files.append('secondRating', this.state.ratings.second.toString());
  //     files.append('averageRating', ((this.state.ratings.first + this.state.ratings.second) / 2).toString());
  //
  //     this.setState({showModal: true});
  //
  //     axios.post(documents.post, files)
  //       .then(() => {
  //         this.setState({showModal: false}, this.fetch)
  //       });
  //   }
  // };

  render() {
    const evaluationTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Evaluation for applications for { this.state.jobTitle }</p>
        {
          this.state.isEvaluationDone ?
            <p className={styles.titleBarLabel}>EVALUATION DONE</p> :
            null
        }
      </div>;

    let uploadDisabled = false;

    // this.state.uploadContainers.forEach(con => {
    //   if(!con.isValid) {
    //     uploadDisabled = true
    //   }
    // });

    const bottomBar =
      <div
        className={univStyles.titleBar + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <div style={{marginLeft: 'auto', marginRight: 15}}>
          <Button
            style={{marginLeft: 15}}
            onClick={this.onNext}
            classNames={['tertiary']}
            name="SAVE EVALUATION"/>
        </div>
      </div>;

    // const uploadContainers = this.state.uploadContainers.map((container, i) => {
      {/*return (*/}
        {/*<div className={styles.uploadContainer}>*/}
          {/*<input*/}
    //         accept={container.accept}
    //         onChange={() => this.onChangeUploadContainer(i)}
    //         ref={container.name}
    //         type="file"/>
          {/*<div className={styles.iconContainer}>*/}
          {/*</div>*/}
          {/*<div>*/}
    //         <p className={styles.uploadContainerName}>{ container.name }</p>
    //         <p className={styles.metaData}>
    //           {
                {/*container.isValid ?*/}
                  {/*Math.round(container.fileSize / 1000) + ' KB' :*/}
                  {/*'File size'*/}
    //           }
    //         </p>
    //         <p className={styles.metaData}>&#8226;</p>
    //         <p className={styles.metaData}>
    //           {
    //             container.isValid ?
    //               container.fileName :
    //               'File name'
    //           }
            {/*</p>*/}
          {/*</div>*/}
    //       {
            {/*container.isValid ?*/}
              {/*<Button*/}
                {/*onClick={() => this.refs[container.name].click()}*/}
                {/*classNames={['tertiary']}*/}
                {/*name="CHANGE FILE"/> :*/}
    //           <Button
    //             onClick={() => this.refs[container.name].click()}
    //             classNames={['primary']}
    //             name="UPLOAD FILE"/>
    //       }
    //     </div>
    //   )
    // });

    return (
      <Fragment>
        {/*{*/}
          {/*this.state.showModal ?*/}
            {/*<Portal>*/}
              {/*<Modal/>*/}
            {/*</Portal> :*/}
            {/*null*/}
        {/*}*/}
        { evaluationTitleBar }
        <div className={univStyles.main}>
          <div className={univStyles.pageMain}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>Ranking list</p>
              </div>
              <div className={univStyles.formBody}>
                <div style={{padding: 15}}>

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
    role: state.authentication.role,
    employeeId: state.authentication.employeeId
  }
};

export default withRouter(connect(mapStateToProps)(ViewEvaluation));

