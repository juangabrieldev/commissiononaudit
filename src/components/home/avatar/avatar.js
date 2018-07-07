import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SVG from 'react-svg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styles from './avatar.scss';

import Aux from '../../auxillary/auxillary';
import Dropdown from '../dropdown/dropdown';

import downArrow from '../../../assets/ui/downArrow.svg';

class Avatar extends Component {
  state = {
    showAvatarDropdown: false
  };

  componentWillReceiveProps = next => {
    if(next.showAvatarDropdown !== this.props.showAvatarDropdown) {
      this.setState({showAvatarDropdown: next.showAvatarDropdown})
    }
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
                      <p>Log out</p>
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

export default withRouter(connect(mapStateToProps)(Avatar));
