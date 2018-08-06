import React, {Component} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import axios from 'axios';
import moment from 'moment';

import styles from './sideBarRight.scss';

import {systemLogs} from "../../../api";

import { initializeSocket, events } from "../../../socket";

class SideBarRight extends Component {
  state = {
    logs: [],
    showTransition: false,
    selectedLog: null
  };

  fetch = () => {
    axios.get(systemLogs.get)
      .then(res => {
        this.setState({logs: res.data.data})
      });
  };

  componentDidMount = () => {
    this.fetch();

    const socket = initializeSocket();

    socket.on(events.systemLogs, () => {
      this.setState({showTransition: true});
      this.fetch();
    });

    setInterval(() => {
      this.setState(this.state)
    }, 1000)
  };

  systemLogView = i => {
    this.setState({selectedLog: i})
  };

  render() {
    const popup =
      <div className={styles.popup}>
        <div className={styles.triangle}/>
      </div>;

    return (
      <div className={styles.sideBar + (this.state.selectedLog !== null ? ' ' + styles.zIndex : '')}>
        <div className={styles.systemLogs}>
          <div className={styles.header}>
            <p>SYSTEM LOGS</p>
          </div>
          <div className={styles.systemLogsItems}>
            <TransitionGroup exit={false} component={null} enter={this.state.showTransition}>
              {
                this.state.logs.map((log, i) => {
                  return (
                    <CSSTransition
                      key={i}
                      classNames={{
                        enter: styles.enter,
                        enterActive: styles.enterActive,
                      }}
                      timeout={4000}>
                      <div onClick={() => this.systemLogView(i)} className={styles.systemLogsItem + (this.state.selectedLog === i ? ' ' + styles.selected: '')}>
                        {
                          this.state.selectedLog === i ?
                            popup :
                            null
                        }
                        <div className={styles.event}>
                          <p>
                        <span>
                          {
                            this.props.employeeId === log.from ?
                              'You' :
                              log.fromname
                          }
                        </span> {log.event} { log.subject.charAt(0) === 'e' ? 'an' : 'a'} <span>{log.subject}</span>.
                          </p>
                        </div>
                        <div className={styles.time}>
                          <p>{moment(log.time).from(moment())}</p>
                        </div>
                      </div>
                    </CSSTransition>
                  )
                })
              }
            </TransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default SideBarRight;
