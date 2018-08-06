import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SVG from 'react-svg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styles from './avatar.scss';

import Aux from '../../auxillary/auxillary';
import Dropdown from '../dropdown/dropdown';

import downArrow from '../../../assets/ui/downArrow.svg';

import { logout } from '../../../store/actions/authentication/authentication'

class Avatar extends Component {
  state = {
    showAvatarDropdown: false
  };

  componentWillReceiveProps = next => {
    if(next.showAvatarDropdown !== this.props.showAvatarDropdown) {
      this.setState({showAvatarDropdown: next.showAvatarDropdown})
    }
  };

  logout = () => {
    const recents = JSON.parse(localStorage.getItem('recent'));
    let recentsNew = [];
    if(recents != null) {
      for(let i = 0; i < recents.length; i++) {

      }
    }
    this.props.logout();
    this.props.history.replace('/');
  };

  render() {
    return (
      <Aux>
        <div onClick={e => this.props.onClick(e)} className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <p>{this.props.firstName.charAt(0) + this.props.lastName.charAt(0)}</p>
            <div className={styles.online}/>
          </div>
          <div className={styles.username}>
            <p>{this.props.firstName}</p>
          </div>
          <img src={downArrow} height={4} alt=""/>
        </div>
        <TransitionGroup component={null}>
          {
            this.state.showAvatarDropdown ?
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
                        <div className={styles.avatarBig}>
                          <div className={styles.change}>
                            <p>Change picture</p>
                          </div>
                          <p>{this.props.firstName.charAt(0) + this.props.lastName.charAt(0)}</p>
                        </div>
                      </div>
                      <div className={styles.right}>
                        <p className={styles.name}>{`${this.props.firstName} ${this.props.middleInitial} ${this.props.lastName}`}</p>
                        <p className={styles.job}>Administrator</p>
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
    email: state.authentication.email
  }
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Avatar));
