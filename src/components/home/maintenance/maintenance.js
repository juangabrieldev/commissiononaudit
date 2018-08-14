import React, {Component} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import ReactSVG from 'react-svg';
import SwitchCSSTransitionGroup from 'switch-css-transition-group'
import Slug from 'slugify';

import styles from '../styles.scss';

import Office from './office/office';
import Jobs from './jobs/jobs';
import QualificationStandards from './qualificationStandards/qualificationStandards';
import SideBar from '../sideBar/sideBar';

import departments from '../../../assets/ui/departments.svg';
import documents from '../../../assets/ui/documents.svg';
import employees from '../../../assets/ui/employees.svg';
import jobs from '../../../assets/ui/jobs.svg';

class Maintenance extends Component {
  componentDidMount = () => {
    if(this.props.location.pathname === '/maintenance' || this.props.location.pathname === '/maintenance/') {
      this.props.history.push('/maintenance/office');
    }

    if(this.props.location.pathname.includes('/new')) {
      this.setState({zeroTop: true})
    } else {
      this.setState({zeroTop: false})
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

  state = {
    tabs: ['Employees', 'Qualification Standards', 'Jobs', 'Office'],
    icons: [employees, documents, jobs, departments],
    overflowHidden: false,
    zeroTop: false
  };

  navigate = url => {
    this.props.history.push('/maintenance/' + url)
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

            if(this.props.location.pathname.includes(Slug(tab.toLowerCase()))) { //bad code
              className = styles.active;
              style.fill = '#4688FF'
            }

            return (
              <div key={index} className={styles.sideBarTabs}>
                <ReactSVG path={this.state.icons[index]} svgStyle={style} svgClassName={styles.icon}/>
                <p
                  onClick={() => this.navigate(Slug(tab.toLowerCase()))}
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
        <div className={styles.page + (this.state.overflowHidden ? ' ' + styles.overflowHidden : '')}>
          <SideBar>
            {sideBarTabs}
          </SideBar>
          <div className={styles.container + (this.state.zeroTop ? ' ' + styles.zeroTop : '')}>
            <Switch>
              <Route path={this.props.match.path + '/jobs'} component={Jobs}/>
              <Route path={this.props.match.path + '/office'} component={Office}/>
              <Route path={this.props.match.path + '/qualification-standards'} component={QualificationStandards}/>
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Maintenance);
