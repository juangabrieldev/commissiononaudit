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
            <p>J</p>
            <div className={styles.online}/>
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
                <Dropdown offset={12}>
                  <div className={styles.dropdown}>
                    <div className={styles.title}>
                      <p className={styles.name}>Juan Gabriel Palarpalar</p>
                      <p className={styles.job}>Administrator</p>
                      <p className={styles.job}>juangabrielpalarpalar@gmail.com</p>
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
    showAvatarDropdown: state.ui.showAvatarDropdown
  }
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Avatar));
