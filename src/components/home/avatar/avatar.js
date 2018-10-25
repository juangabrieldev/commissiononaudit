import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SVG from 'react-svg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import hexRgb from 'hex-rgb';

import styles from './avatar.scss';

import Aux from '../../auxillary/auxillary';
import Dropdown from '../dropdown/dropdown';

import downArrow from '../../../assets/ui/downArrow.svg';



import { logout } from '../../../store/actions/authentication/authentication'
import {employees, publicFolder} from "../../../api";

class Avatar extends Component {
  state = {
    hasUrl: false,
    imageUrl: null
  };

  componentDidMount = () => {
    if(this.props.showAvatarDropdown) {
      this.refs.bad.click()
    }

    axios.get(employees.avatar + this.props.employeeId)
      .then(res => {
        if(res.data.data != null) {
          this.setState({
            hasUrl: true,
            imageUrl: res.data.data
          })
        }
      });
  };

  componentWillMount = () => {
    switch(this.props.role) {
      case 1: {
        this.role = 'Admin Officer';
        break;
      }

      case 2: {
        this.role = 'Applicant';
        break;
      }

      case 3: {
        this.role = 'By-cluster evaluator';
        break;
      }

      case 4: {
        this.role = 'Division Chief';
        break;
      }

      case 5: {
        this.role = 'HR-Evaluator';
        break;
      }

      case 6: {
        this.role = 'Supervisor';
        break;
      }

      case 7: {
        this.role = 'ICTO-Maintenance';
        break;
      }

      default: break;
    }
  };

  componentWillReceiveProps = next => {
    this.setState({showAvatarDropdown: next.showAvatarDropdown})
  };

  logout = () => {
    this.props.logout();
    this.props.history.replace('/');
  };

  render() {
    const { red, green, blue } = (!this.state.hasUrl ? hexRgb(this.props.imageUrl.color) : {});

    return (
      <Aux>
        <div ref="bad" onClick={e => this.props.onClick(e)} className={styles.avatarContainer}>
          <div
            className={styles.avatar}
            style={{
              background: (!this.state.hasUrl ? `rgba(${red}, ${green}, ${blue}, .15)` : '')
            }}>
            {
              this.state.hasUrl ?
                <img src={publicFolder.images + this.state.imageUrl} height={30} alt=""/> :
                <p style={{color: this.props.imageUrl.color}}>{this.props.firstName.charAt(0) + this.props.lastName.charAt(0)}</p>
            }
            <div className={styles.online}/>
          </div>
          <div className={styles.username}>
            <p>{this.props.firstName} ({this.role})</p>
          </div>
          <img src={downArrow} height={4} alt=""/>
        </div>
        <TransitionGroup component={null}>
          {
            this.props.showAvatarDropdown ?
              <CSSTransition
                timeout={300}
                classNames={{
                  enter: styles.enter,
                  enterActive: styles.enterActive,
                  exit: styles.exit,
                  exitActive: styles.exitActive
                }}>
                <Dropdown triangleOffset={10} offset={0}>
                  <div className={styles.dropdown}>
                    <div className={styles.title}>
                      <div className={styles.left}>
                        <div
                          className={styles.avatarBig}
                          style={{
                            background: (!this.state.hasUrl ? `rgba(${red}, ${green}, ${blue}, .15)` : '')
                          }}>
                          <div className={styles.change}>
                            <p>Change picture</p>
                          </div>
                          {
                            this.state.hasUrl ?
                              <img src={publicFolder.images + this.state.imageUrl} height={60} alt=""/> :
                              <p style={{color: this.props.imageUrl.color}}>{this.props.firstName.charAt(0) + this.props.lastName.charAt(0)}</p>
                          }
                        </div>
                      </div>
                      <div className={styles.right}>
                        <p className={styles.name}>{`${this.props.firstName} ${(this.props.middleInitial != null ? this.props.middleInitial : '')} ${this.props.lastName}`}</p>
                        <p className={styles.job}>{this.role}</p>
                        <p className={styles.job}>{this.props.email}</p>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <p>Settings</p>
                      <p onClick={this.logout}>Log out</p>
                    </div>
                  </div>
                </Dropdown>
              </CSSTransition> : null
          }
        </TransitionGroup>
      </Aux>
    )
  }
}

const mapStateToProps = state => {
  return {
    showAvatarDropdown: state.ui.showAvatarDropdown,
    firstName: state.authentication.firstName,
    middleInitial: state.authentication.middleInitial,
    lastName: state.authentication.lastName,
    email: state.authentication.email,
    employeeId: state.authentication.employeeId,
    imageUrl: state.authentication.imageUrl,
    role: state.authentication.role
  }
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Avatar));
