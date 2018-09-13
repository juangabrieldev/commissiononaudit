import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import slug from 'slugify';
import ReactSVG from "react-svg";

import styles from './announcements.scss';
import univStyles from '../styles.scss';

import Aux from '../../auxillary/auxillary';
import Button from '../../button/button';
import SideBar from '../sideBar/sideBar';

import Announcements from './announcements/announcements';
import JobOpportunities from './jobOpportunities/jobOpportunities';

import { announcements } from "../../../api";

import announcementsIcon from '../../../assets/ui/announcements.svg';
import jobsIcon from '../../../assets/ui/jobs.svg';

class AnnouncementsClass extends Component {
  state = {
    tabs: ['Announcements', 'Job Opportunities'],
    icons: [announcementsIcon, jobsIcon],
    overflowHidden: false,
    zeroTop: false
  };

  navigate = url => {
    if(url === 'announcements') {
      this.props.history.push('/announcements')
    } else {
      this.props.history.push('/announcements/' + url)
    }
  };

  componentWillReceiveProps = next => {
    if(this.props.location.pathname !== next.location.pathname) {
      this.setState({overflowHidden: true}, () => {
        setTimeout(() => {
          this.setState({overflowHidden: false})
        }, 200)
      });

      if(next.location.pathname.includes('/new')) {
        this.setState({zeroTop: true})
      } else {
        this.setState({zeroTop: false})
      }
    }
  };

  componentDidMount = () => {
    if(this.props.location.pathname === '/maintenance' || this.props.location.pathname === '/maintenance/') {
      this.props.history.push('/maintenance/employees');
    }

    if(this.props.location.pathname.includes('/new')) {
      this.setState({zeroTop: true})
    } else {
      this.setState({zeroTop: false})
    }
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

            if(index === 0 && this.props.location.pathname === ('/' + tab.toLowerCase()) || index === 0 && this.props.location.pathname === ('/' + tab.toLowerCase()) + '/' || index === 0 && this.props.location.pathname === ('/' + tab.toLowerCase()) + '/new') {
              className = univStyles.active;
              style.fill = '#4688FF'
            } else if(index !== 0 && this.props.location.pathname.includes('/' + slug(tab.toLowerCase()))) {
              className = univStyles.active;
              style.fill = '#4688FF'
            }

            return (
              <div key={index} className={univStyles.sideBarTabs}>
                <ReactSVG path={this.state.icons[index]} svgStyle={style} svgClassName={univStyles.icon}/>
                <p
                  onClick={() => this.navigate(slug(tab.toLowerCase()))}
                  className={className}>
                  {tab}
                </p>
              </div>
            )
          })
        }
      </React.Fragment>;

    return (
      <React.Fragment>
        <div className={univStyles.page + (this.state.overflowHidden ? ' ' + univStyles.overflowHidden : '')}>
          <SideBar>
            {sideBarTabs}
          </SideBar>
          <div className={univStyles.container + ' ' + univStyles.fullWidth + (this.state.zeroTop ? ' ' + univStyles.zeroTop : '')}>
            <Switch>
              <Route path={'/announcements/job-opportunities'} component={JobOpportunities}/>
              <Route path={'/announcements'} component={Announcements}/>
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.authentication.role
  }
};

export default withRouter(connect(mapStateToProps)(AnnouncementsClass));
