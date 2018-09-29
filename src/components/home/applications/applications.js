import React, {Component, Fragment} from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import slug from "slugify";
import ReactSVG from "react-svg";

import univStyles from '../styles.scss';

import SideBar from "../sideBar/sideBar";
import ApplicationsOverView from '../applications/applications/applications';

import applicationsIcon from '../../../assets/ui/documents.svg';

class Applications extends Component {
  state = {
    tabs: this.props.role === 2 ? ['My applications'] : ['Applications'],
    icons: [applicationsIcon],
    overflowHidden: false,
    zeroTop: false
  };

  navigate = url => {
    if(url === 'my-applications' || url === 'applications') {
      this.props.history.push('/applications')
    } else {
      this.props.history.push('/applications/' + url)
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

            if(index === 0 && this.props.location.pathname === ('/applications')) {
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
                <Route path={'/applications'} component={ApplicationsOverView}/>
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

export default withRouter(connect(mapStateToProps)(Applications));
