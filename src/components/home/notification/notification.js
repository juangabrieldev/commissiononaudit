import React, { Component, Fragment } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SVG from 'react-svg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import styles from './styles.scss';

import Dropdown from '../dropdown/dropdown';

import notification from '../../../assets/ui/notification.svg';

import { events, initializeSocket } from "../../../socket";

import { notifications } from '../../../api';

class Notification extends Component {
  state = {
    hasUrl: false,
    imageUrl: null
  };

  componentDidMount = () => {
    // if(this.props.showAvatarDropdown) {
    //   this.refs.bad.click()
    // }
    //
    // axios.get(employees.avatar + this.props.employeeId)
    //   .then(res => {
    //     if(res.data.data != null) {
    //       this.setState({
    //         hasUrl: true,
    //         imageUrl: res.data.data
    //       })
    //     }
    //   });

    const socket = initializeSocket();

    socket.on(events.notifications, this.fetch)
  };

  fetch = () => {
    axios.get(notifications.new + this.props.employeeId)
      .then(res => {})
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

  logout = () => {
    this.props.logout();
    this.props.history.replace('/');
  };

  onClick = e => {
    this.props.onClick(e)
  };

  render() {
    return (
      <Fragment>
        <div onClick={this.onClick} className={styles.notification}>
          <p>2</p>
          <img src={notification} height={20} style={{opacity: .3}} alt=""/>
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

                </Dropdown>
              </CSSTransition> : null
          }
        </TransitionGroup>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    showNotificationDropdown: state.ui.showNotificationDropdown,
    employeeId: state.authentication.employeeId
  }
};

// const mapDispatchToProps = dispatch => {
//   return {
//     logout: () => dispatch(logout())
//   }
// };

export default withRouter(connect(mapStateToProps)(Notification));
// export default Notification;