import React, {Component} from 'react';
import { Switch, Route, Link, Prompt, withRouter  } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import produce from 'immer';
import axios from 'axios';
import moment from 'moment';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Highlighter from 'react-highlight-words';

import styles from './office.scss';
import univStyles from '../../styles.scss';

import Alert from '../../../alert/alert';
import Button from '../../../button/button';
import Checkbox from '../../../checkBox/checkBox';
import DeleteConfirmationModal from '../../../confirmationModal/deleteConfirmationModal';
import Input from '../../../input/input';
import SearchBar from '../../searchBar/searchBar';
import TextArea from '../../../textarea/textArea';

import * as actions from '../../../../store/actions/ui/actions';

import { office } from "../../../../api";

import { addToast } from "../../../../store/actions/ui/ui";

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
    searchOffice: [], //rows of searched office
    selectedOffice: [],
    previousLink: '/maintenance/office',
    slug: '',
    showTransition: false,
    saveDisabled: true,
    search: false,
    splitString: null,
    searchValue: undefined,
    cursor: 0,
    isLoaded: false,
    deleteOffice: {
      showDeleteConfirmationModal: false,
      password: '',
      passwordIncorrect: false
    }
  };

  fetch = () => {
    axios.get(office.get)
      .then(res => {
        if (res.data.status === 200) {
          if(this.mounted) {
            this.setState({
              office: [...res.data.data],
              selectedOffice: [],
              previousLink: '/maintenance/office',
              isLoaded: true,
            }, () => this.setState({showTransition: true}))
          }
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
        numberOfClusters: 0,
        officeDescription: '',
        blockedNavigation: false,
        selectedOffice: [],
        slug: '',
        showTransition: false,
        saveDisabled: true,
        search: false,
        splitString: null,
        searchValue: null,
        cursor: 0
      });
    }
  };

  componentDidMount = () => {
    this.mounted = true;

    this.fetch();

    const socket = initializeSocket();

    socket.on(events.office, this.fetch)
  };

  onChangeSearchJobs = e => {
    const value = e.target.value;

    if(value.length === 0) {
      document.removeEventListener('keydown', this.selectSearchJobs);

      return this.setState({
        searchValue: null,
        search: false,
        showTransition: false,
        cursor: 0
      })
    }

    axios.get(office.search + `/${value}`)
      .then(res => {
        document.addEventListener('keydown', this.selectSearchJobs);

        this.setState({
          search: true,
          searchOffice: res.data.data,
          splitString: value.split(' '),
          searchValue: value,
          showTransition: false,
          cursor: 0
        })
      })
  };

  selectSearchJobs = e => {
    switch(e.which) {
      case 38: {
        if(this.state.cursor === 0) {
          this.setState({cursor: this.state.searchOffice.length})
        } else {
          this.setState({cursor: this.state.cursor - 1})
        }

        break;
      }

      case 40: {
        if(this.state.cursor + 1 <= this.state.searchOffice.length) {
          this.setState({cursor: this.state.cursor + 1})
        } else {
          this.setState({cursor: 0})
        }

        break;
      }

      case 13: {
        if(this.state.cursor !== 0) {
          this.props.history.push('/maintenance/office/' + this.state.searchOffice[this.state.cursor - 1].slug)
        }
      }
    }
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
    this.setState({saveDisabled: !(this.state.officeName.length > 9 && this.state.numberOfClusters > 0)})
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
      employeeId: this.props.employeeId,
      firstName: this.props.firstName,
      numberOfClusters: this.state.numberOfClusters
    })
      .then(res => {
        if(res.data.status === 200) {
          this.props.blockNavigation(false);
          this.props.addtoast(`Successfully added ${this.state.officeName}.`);
          this.reset();
          this.props.history.push('/maintenance/office/');
        }
      })
  };

  onDelete = () => {
    this.setState({
      ...this.state,
      deleteOffice: {
        ...this.state.deleteOffice,
        showDeleteConfirmationModal: true
      }
    })
  };

  onDeleteCancel = () => {
    this.setState({
      ...this.state,
      deleteOffice: {
        ...this.state.deleteOffice,
        showDeleteConfirmationModal: false
      }
    })
  };

  onDeleteConfirm = () => {
    axios.post(office.delete, {
      id: [...this.state.selectedOffice],
      employeeId: this.props.employeeId,
      firstName: this.props.firstName,
      password: this.state.deleteOffice.password
    })
      .then(res => {
        if(res.data.status === 200) {
          this.setState(produce(draft => {
            draft.deleteOffice.passwordIncorrect = false;
            draft.deleteOffice.showDeleteConfirmationModal = false;
            draft.deleteOffice.password = '';
          }));
          this.props.addtoast('Office successfully deleted.')
        } else {
          this.setState(produce(draft => {
            draft.deleteOffice.passwordIncorrect = true;
            draft.deleteOffice.password = '';
          }))
        }
      })
  };

  onChangePassword = e => {
    const value = e.target.value;

    this.setState(produce(draft => {
      draft.deleteOffice.password = value
    }))
  };

  render() {
    const officeTitleBar =
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

    const officeRows = this.state.office.map(office => {
      const selected = this.state.selectedOffice.find(element => {
        return element === office.id;
      });

      return (
        <CSSTransition
          key={office.key}
          timeout={4000}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
          }}>
          <div className={styles.row + (selected ? ' ' + styles.selected : '')}>
            <div className={styles.select}>
              <Checkbox toggle={value => this.onSelect(office.id, value)} />
            </div>
            <div className={styles.employeeNameRow}>
              <Link to={'/maintenance/office/' + office.slug}>{office.officeName}</Link>
              {
                office.newDepartment ?
                  <span>NEW</span> :
                  null
              }
            </div>
            <div className={styles.filler}>
            </div>
            <div className={styles.registrationStatusRow}>
              <p title={'Created on ' + moment(office.dateCreated).format('dddd, MMMM D, YYYY') + ' at ' + moment(office.dateCreated).format('h:mm A')}>{moment(office.dateCreated).format('MMMM D, YYYY')}</p>
            </div>
            <div className={styles.verificationStatusRow}>
              <p>{office.count}</p>
              <div className={styles.options}>
                <div/>
                <div/>
                <div/>
              </div>
            </div>
          </div>
        </CSSTransition>
      )
    });

    const searchedOfficeRows = this.state.searchOffice.map((office, i) => {
      const selected = this.state.selectedOffice.find(element => {
        return element === office.id;
      });

      return (
        <CSSTransition
          key={office.key}
          timeout={4000}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
          }}>
          <div className={styles.row + (selected ? ' ' + styles.selected : '') + (i === this.state.cursor - 1 ? ' ' + styles.cursorSelected : '')}>
            <div className={styles.select}>
              <Checkbox toggle={value => this.onSelect(office.id, value)} />
            </div>
            <div className={styles.employeeNameRow}>
              <Link to={'/maintenance/office/' + office.slug}>
                <Highlighter
                  autoEscape
                  searchWords={this.state.splitString}
                  textToHighlight={office.officename}/>
              </Link>
              {
                office.newDepartment ?
                  <span>NEW</span> :
                  null
              }
            </div>
            <div className={styles.filler}>
            </div>
            <div className={styles.registrationStatusRow}>
              <p title={'Created on ' + moment(office.dateCreated).format('dddd, MMMM D, YYYY') + ' at ' + moment(office.dateCreated).format('h:mm A')}>{moment(office.dateCreated).format('MMMM D, YYYY')}</p>
            </div>
            <div className={styles.verificationStatusRow}>
              <p>{office.count}</p>
              <div className={styles.options}>
                <div/>
                <div/>
                <div/>
              </div>
            </div>
          </div>
        </CSSTransition>
      )
    });

    return (
      <React.Fragment>
        {officeTitleBar}
        {
          this.state.deleteOffice.showDeleteConfirmationModal ?
            <DeleteConfirmationModal>
              <div className={styles.background}>
                <div style={{position: 'relative', height: '100%', width: '100%'}}>
                  <div className={styles.form}>
                    <div className={styles.header}>
                      <p>Are you really sure?</p>
                    </div>
                    <div className={styles.formBody}>
                      <div style={{padding: 20, paddingBottom: 0}}>
                        {
                          this.state.deleteOffice.passwordIncorrect ?
                            <div style={{marginBottom: 20}}>
                              <Alert type="error" message="Password is incorrect."/>
                            </div> :
                            null
                        }
                        <p>This action <strong>cannot be undone.</strong> Selected office will be <strong>permanently deleted.</strong> All the employees and clusters will also be affected.</p>
                        <br/>
                        <p>Please enter your password to confirm.</p>
                        <Input autofocus width="100%" value={this.state.deleteOffice.password} type="password" onChangeHandler={e => this.onChangePassword(e)} name="Password"/>
                      </div>
                      <div className={styles.footer}>
                        <Button classNames={['cancel']} onClick={this.onDeleteCancel} name="CANCEL"/>
                        <Button disabled={this.state.deleteOffice.password.length === 0} classNames={['tertiary']} onClick={this.onDeleteConfirm} name="I UNDERSTAND, DELETE THIS OFFICE"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DeleteConfirmationModal> :
            null
        }
        <Switch>
          <Route path={'/maintenance/office'} exact render={() =>
            <div className={univStyles.main}>
              <div className={univStyles.pageMainNew + ' ' + univStyles.top} />
              {
                this.state.isLoaded ?
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
                          onChangeHandler={e => this.onChangeSearchJobs(e)}
                          value={this.state.searchValue}
                          placeholder="Search Office"
                          style={{
                            width: 170,
                            marginRight: 12,
                            marginLeft: this.state.selectedOffice.length === 0 ? 'auto' : ''
                          }}/>
                      </div>
                      <div className={univStyles.formBody}>
                        <div className={styles.rowHeader}>
                          <div className={styles.employeeName}>
                            <p>Office name</p>
                          </div>
                          <div className={styles.registrationStatus}>
                            <p>Date added</p>
                          </div>
                          <div className={styles.verificationStatus}>
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
                              {
                                this.state.search ?
                                  searchedOfficeRows :
                                  officeRows
                              }
                            </TransitionGroup>
                            <p className={styles.end}>end of results</p>
                          </Scrollbars>
                        </div>
                      </div>
                    </div>
                  </div> :
                  null
              }
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
                          characterLimit={100}
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
      }),
    addtoast: message => dispatch(addToast(message))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Office));
