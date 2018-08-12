import React, {Component} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Spin from 'react-md-spinner';

import styles from './announcements.scss';
import univStyles from '../styles.scss';

import Aux from '../../auxillary/auxillary';
import Button from '../../button/button';
import SideBar from '../sideBar/sideBar';
import ReactSVG from "react-svg";

import { announcements } from "../../../api";

import announcementsIcon from '../../../assets/ui/announcements.svg';

class Announcements extends Component {
  state = {
    tabs: ['Announcements'],
    icons: [announcementsIcon],
  };

  componentDidMount = () => {
  };

  navigate = url => {
    if(url === 'announcements') {
      return
    }

    this.props.history.push('/announcements/' + url)
  };

  render() {
    const sideBarTabs =
      <React.Fragment>
        {
          this.state.tabs.map((tab, index) => {
            let className = '';
            let style = {
              fill: '#a3abaf'
            };

            if(this.props.location.pathname.includes('/' + tab.toLowerCase())) {
              className = univStyles.active;
              style.fill = '#4688FF'
            }

            return (
              <div key={index} className={univStyles.sideBarTabs}>
                <ReactSVG path={this.state.icons[index]} svgStyle={style} svgClassName={univStyles.icon}/>
                <p
                  onClick={() => this.navigate(tab.toLowerCase())}
                  className={className}>
                  {tab}
                </p>
              </div>
            )
          })
        }
      </React.Fragment>;

    const titleBar =
      <div className={univStyles.titleBar + ' ' + (this.props.location.pathname.includes('/new') ? univStyles.bottom + ' ' : '') + univStyles.fullWidth}>
        {
          this.props.location.pathname.includes('/new') ?
            <React.Fragment>
              <p>Create a new post</p>
              <Link to="/announcements">Cancel</Link>
            </React.Fragment> :
            <Aux>
              <p>Announcements</p>
              <Button onClick={() => this.props.history.push('/announcements/new')} classNames={['primary']} name="+  CREATE A NEW POST"/>
            </Aux>
        }
      </div>;

    const announcements =
      <div className={univStyles.main}>
        <div className={univStyles.pageMainNew + ' ' + univStyles.top}/>
        <div className={univStyles.pageMain}>
          <div className={univStyles.form}>
            <div className={univStyles.header}>
              <p>News and Announcements</p>
            </div>
            <div className={univStyles.formBody}>
              <div className={styles.announcements}>
                <div className={styles.left}>
                  <div className={univStyles.section}>
                    <div className={univStyles.fields}>
                      <p>ANNOUNCEMENTS AND JOB OPPORTUNITIES</p>
                    </div>
                    <div className={styles.announcement}>
                      <a className={styles.announcementTitle}>List of Qualifiers May 2018</a>
                    </div>
                    <div className={styles.announcement}>
                      <a className={styles.announcementTitle}>List of Qualifiers May 2018</a>
                    </div>
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.pastAnnouncements}>
                    <div className={univStyles.fields}>
                      <p>PAST ANNOUNCEMENTS</p>
                    </div>
                    <div className={styles.pastAnnouncement}>
                      <p>List of blahblahblah</p>
                    </div>
                    <div className={styles.pastAnnouncement}>
                      <p>Sample Announcement</p>
                    </div>
                    <div className={styles.pastAnnouncement}>
                      <p>Sample Announcement</p>
                    </div>
                    <div className={styles.pastAnnouncement}>
                      <p>Sample Announcement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;

    const newPost =
      <div className={univStyles.main}>
        <div className={univStyles.pageMainNew}>
          haaaaa
        </div>
        <div className={univStyles.pageMain + ' ' + univStyles.bottom}/>
      </div>;

    return (
      <React.Fragment>
        <div className={univStyles.page}>
          <SideBar>
            {sideBarTabs}
          </SideBar>
          <div className={univStyles.container + ' ' + univStyles.fullWidth}>
            {titleBar}
            <Switch>
              <Route path={'/announcements'} exact render={() => announcements}/>
              <Route path={'/announcements/new'} exact render={() => newPost}/>
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Announcements);
