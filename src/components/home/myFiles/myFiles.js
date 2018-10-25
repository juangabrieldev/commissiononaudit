import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import slug from "slugify";
import ReactSVG from "react-svg";

import univStyles from '../styles.scss';

import files from '../../../assets/ui/files.svg';
import pds from '../../../assets/ui/documents.svg';

import SideBar from "../sideBar/sideBar";

import MyFilesOverview from './myFiles/myFiles';
import PersonalDataSheet from './personalDataSheet/personalDataSheet';

class MyFiles extends Component {
  state = {
    tabs: ['My files', 'Personal Data Sheet'],
    icons: [files, pds],
    overflowHidden: false,
    zeroTop: false
  };

  navigate = url => {
    if(url === 'my-files') {
      this.props.history.push('/my-files')
    } else {
      this.props.history.push('/my-files/' + url)
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

  render() {
    const sideBarTabs =
      <Fragment>
        {
          this.state.tabs.map((tab, index) => {
            let className = '';
            let style = {
              fill: '#a3abaf'
            };

            if(index === 0 && this.props.location.pathname === '/my-files') {
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
      </Fragment>;

    return (
      <Fragment>
        <div className={univStyles.page + (this.state.overflowHidden ? ' ' + univStyles.overflowHidden : '')}>
          <SideBar>
            {sideBarTabs}
          </SideBar>
          <div className={univStyles.container + ' ' + univStyles.fullWidth + (this.state.zeroTop ? ' ' + univStyles.zeroTop : '')}>
            <Switch>
              <Route path={'/my-files'} exact component={MyFilesOverview}/>
              <Route path={'/my-files/personal-data-sheet'} exact component={PersonalDataSheet}/>
              {/*<Route path={'/applications/:token'} exact component={ViewApplication}/>*/}
              {/*<Route path={'/applications/applicants/:jobId/:jobOpportunityId'} exact component={Applicants}/>*/}
            </Switch>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    role: state.authentication.role
  }
};

export default withRouter(connect(mapStateToProps)(MyFiles));
