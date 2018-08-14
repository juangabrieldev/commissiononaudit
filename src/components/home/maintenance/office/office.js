import React, {Component} from 'react';
import { Switch, Route, Link, Prompt, withRouter  } from 'react-router-dom';
import ReactSVG from 'react-svg';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import Slug from 'slugify';
import produce from 'immer';
import axios from 'axios';
import moment from 'moment';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import styles from './office.scss';
import univStyles from '../../styles.scss';

import Button from '../../../button/button';
import Checkbox from '../../../checkBox/checkBox';
import Input from '../../../input/input';
import SearchBar from '../../searchBar/searchBar';
import TextArea from '../../../textarea/textArea';

import departmentsWidget from '../../../../assets/ui/departments.svg';
import leaf from '../../../../assets/ui/leaf.svg';

import * as actions from '../../../../store/actions/ui/actions';

import { office } from "../../../../api";

import { initializeSocket, events } from "../../../../socket";
import ViewOffice from "./viewOffice";
import Numeric from "../../../numeric/numeric";

class Office extends Component {
  state = {
    officeName: '',
    numberOfClusters: 0,
    officeDescription: '',
    blockedNavigation: false,
    office: [],
    selectedOffice: [],
    previousLink: '',
    slug: '',
    showTransition: false,
    saveDisabled: true,
  };

  fetch = () => {
    axios.get(office.get)
      .then(res => {
        if (res.data.status === 200) {
          this.setState({
            office: [...res.data.data],
            selectedOffice: [],
            previousLink: '/maintenance/office'
          }, () => this.setState({showTransition: true}))
        }
      });
  };

  reset = () => {
    this.setState({
      officeName: '',
      numberOfClusters: 0,
      officeDescription: '',
      blockedNavigation: false,
      office: [],
      selectedOffice: [],
      previousLink: '',
      slug: '',
      showTransition: false,
      saveDisabled: true
    })
  };

  componentDidUpdate = prev => {
    if (prev.location.pathname !== this.props.location.pathname) {
      this.setState({
        officeName: '',
        officeDescription: ''
      });
    }
  };

  componentDidMount = () => {
    this.fetch();

    const socket = initializeSocket();

    socket.on(events.office, this.fetch)
  };

  onChangeOfficeName = e => {
    const value = e.target.value;

    this.setState({officeName: value}, () => {
      this.blockNavigationChecker();
      this.disabledChecker()
    })
  };

  onChangeNumberOfClusters = v => {
    this.setState({numberOfClusters: v}, () => {
      this.blockNavigationChecker();
      this.disabledChecker()
    })
  };

  onChangeDescription = e => {
    this.setState({officeDescription: e.target.value}, () => {
      this.blockNavigationChecker();
      this.disabledChecker()
    })
  };

  disabledChecker = () => {
    if (this.state.officeName.length > 10 && this.state.numberOfClusters > 0) {
      this.setState({saveDisabled: false})
    } else {
      this.setState({saveDisabled: true})
    }
  };

  blockNavigationChecker = () => {
    if (this.state.officeName.length > 0 || this.state.numberOfClusters > 0 || this.state.officeDescription.length > 0) {
      if (!this.props.blockedNavigation) {
        this.props.blockNavigation(true, `You haven't finished your post yet. Are you sure you want to leave?`);
      }
    } else {
      this.props.blockNavigation(false);
    }
  };

  onCancel = () => {
    this.props.blockNavigation(false);
    setTimeout(() => {
      this.props.history.push(this.state.previousLink);
      this.setState({officeName: ''})
    }, 0);
  };

  onSelect = (id, value) => {
    if(value) {
      this.setState(produce(draft => {
        draft.selectedOffice.push(id)
      }))
    } else {
      const index = this.state.selectedOffice.indexOf(id);

      this.setState(produce(draft => {
        draft.selectedOffice.splice(index, 1)
      }))
    }
  };

  onCreate = () => {
    this.setState({previousLink: this.props.location.pathname});
    this.props.history.push('/maintenance/office/new')
  };

  onSave = () => {
    axios.post(office.create, {
      officeName: this.state.officeName,
      officeDescription: this.state.officeDescription,
      slug: Slug(this.state.officeName.toLowerCase()),
      employeeId: this.props.employeeId,
      firstName: this.props.firstName,
      numberOfClusters: this.state.numberOfClusters
    })
      .then(res => {
        this.reset();
        if(res.data.status === 200) {
          this.props.blockNavigation(false);
          axios.get(office.get)
            .then(res => {
              if(res.data.status === 200) {
                this.props.history.push('/maintenance/office/');
              }
            });
        }
      })
  };

  onDelete = () => {
    axios.post(office.delete, {
      id: [...this.state.selectedOffice],
      employeeId: this.props.employeeId,
      firstName: this.props.firstName
    })
      .then(res => {})
  };

  render() {
    const departmentsTitleBar =
      <div className={univStyles.titleBar + (this.props.location.pathname.includes('/new') ? ' ' + univStyles.bottom : '')}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Create new office</p>
              <a onClick={this.onCancel}>Cancel</a>
              <Button disabled={this.state.saveDisabled} onClick={this.onSave} width={70} classNames={['tertiary']} name="SAVE"/>
            </React.Fragment> :
            <React.Fragment>
              <p>Office</p>
              <Button onClick={this.onCreate} classNames={['primary']} name="+  CREATE NEW OFFICE"/>
            </React.Fragment>
        }
      </div>;

    const departmentRows = this.state.office.map(department => {
      const selected = this.state.selectedOffice.find(element => {
        return element === department.id;
      });

      return (
        <CSSTransition
          key={department.key}
          timeout={4000}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
          }}>
          <div className={styles.row + (selected ? ' ' + styles.selected : '')}>
            <div className={styles.select}>
              <Checkbox toggle={value => this.onSelect(department.id, value)} />
            </div>
            <div className={styles.departmentNameRow}>
              <Link to={'/maintenance/office/' + department.slug}>{department.officeName}</Link>
              {
                department.newDepartment ?
                  <span>NEW</span> :
                  null
              }
            </div>
            <div className={styles.departmentHeadRow}>
              <p>{department.departmentHead}</p>
            </div>
            <div className={styles.dateAddedRow}>
              <p title={'Created on ' + moment(department.dateCreated).format('dddd, MMMM D, YYYY') + ' at ' + moment(department.dateCreated).format('h:mm A')}>{moment(department.dateCreated).format('MMMM D, YYYY')}</p>
            </div>
            <div className={styles.numberOfEmployeesRow}>
              <p>46</p>
              <div className={styles.options}>
                <div/>
                <div/>
                <div/>
              </div>
            </div>
          </div>
        </CSSTransition>
      )
    }
    );

    return (
      <React.Fragment>
        {departmentsTitleBar}
        <Switch>
          <Route path={'/maintenance/office'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>List of Office</p>
                    <p className={univStyles.subtitle}>{this.state.office.length} records</p>
                    {
                      this.state.selectedOffice.length !== 0 ?
                        <p onClick={this.onDelete} className={univStyles.formControl + ' ' + univStyles.delete}>Delete</p> :
                        null
                    }
                    <SearchBar
                      placeholder="Search Office"
                      style={{
                        width: 170,
                        marginRight: 12,
                        marginLeft: this.state.selectedOffice.length === 0 ? 'auto' : ''
                      }}/>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={styles.rowHeader}>
                      <div className={styles.officeName}>
                        <p>Office Name</p>
                      </div>
                      <div className={styles.dateAdded}>
                        <p>Date added</p>
                      </div>
                      <div className={styles.numberOfEmployees}>
                        <p>Number of employees</p>
                      </div>
                    </div>
                    <div className={styles.tableBody}>
                      <Scrollbars
                        style={{
                          width: '100%',
                          maxHeight: 'calc(100vh - 190px)',
                        }}
                        autoHeight
                        autoHide>
                        <TransitionGroup exit={false} component={null} enter={this.state.showTransition}>
                          {departmentRows}
                        </TransitionGroup>
                        <p className={styles.end}>end of results</p>
                      </Scrollbars>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }/>
          <Route path={'/maintenance/office/new'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew}>
                <div className={univStyles.form}>
                  <div className={univStyles.header}>
                    <p>Office Details</p>
                  </div>
                  <div className={univStyles.formBody}>
                    <div className={styles.newBody}>
                      <div className={univStyles.input}>
                        <Input
                          characterLimit={40}
                          autofocus
                          type="text"
                          value={this.state.officeName}
                          onChangeHandler={e => this.onChangeOfficeName(e)}
                          name="* Office Name"/>
                      </div>
                      <div className={univStyles.input}>
                        <Numeric onChangeHandler={v => this.onChangeNumberOfClusters(v)} width={200} name="* Number of clusters"/>
                      </div>
                      <div className={univStyles.input}>
                        <TextArea characterLimit={300} value={this.state.officeDescription} onChangeHandler={e => this.onChangeDescription(e)} name="Description"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={univStyles.pageMain + ' ' + univStyles.bottom} />
            </div>
          }/>
          <Route path={'/maintenance/office/:slug'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              <div className={univStyles.pageMain}>
                <Route path={'/maintenance/office/:slug'} exact component={ViewOffice}/>
              </div>
            </div>
          }/>
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    employeeId: state.authentication.employeeId,
    firstName: state.authentication.firstName
  }
};

const mapDispatchToProps = dispatch => {
  return {
    blockNavigation:
      (value, message) => dispatch({
        type: actions.BLOCK_NAVIGATION,
        payload: {
          value,
          message
        }
      })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Office));
