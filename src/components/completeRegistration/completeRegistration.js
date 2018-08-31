import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import ReactSVG from "react-svg";
import slug from 'slugify';
import axios from 'axios';

import NavigationBar from "../home/navigationBar/navigationBar";
import PersonalDataSheet from './personalDataSheet/personalDataSheet';
import Picture from './picture/picture';
import Sidebar from '../home/sideBar/sideBar';

import styles from './completeRegistration.scss';
import univStyles from '../home/styles.scss'

import checked from '../../assets/ui/checked.svg';
import picture from '../../assets/ui/picture.svg';
import documents from '../../assets/ui/documents.svg';

import { employees } from "../../api";

import { replaceProgress } from "../../store/actions/completeRegistration/completeRegistration";

class CompleteRegistration extends Component {
  state = {
    tabs: ['Choose your picture', 'Personal Data Sheet'],
    icons: [picture, documents]
  };

  componentDidMount = () => {
    if(this.props.location.pathname === '/complete-registration' || this.props.location.pathname === '/complete-registration/') {
      this.props.history.push('/complete-registration/choose-your-picture');
    }

    axios.get(employees.registrationProgress + this.props.employeeId)
      .then(res => {
        this.props.replaceProgress(res.data.data, this.props.employeeId)
      })
  };

  navigate = url => {
    console.log(url);
    this.props.history.push('/complete-registration/' + url)
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

            if(this.props.location.pathname.includes('/' + slug(tab.toLowerCase()))) {
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
                {
                  this.props.progress >= 20 && index === 0 ?
                    <div className={styles.checked}>
                      <img src={checked} height={12} alt=""/>
                    </div> :
                    null
                }
              </div>
            )
          })
        }
        <div className={styles.status}>
          <p className={styles.progressP}>Progress of your application:</p>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.value} style={{width: this.props.progress + '%'}}/>
            </div>
          </div>
        </div>
      </React.Fragment>;


    return (
      <Fragment>
        <NavigationBar />
        <div className={univStyles.page}>
          <Sidebar>
            {sideBarTabs}
          </Sidebar>
          <div className={univStyles.container + ' ' + univStyles.fullWidth}>
            <Switch>
              <Route path={this.props.match.path + '/choose-your-picture'} component={Picture}/>
              <Route path={this.props.match.path + '/personal-data-sheet'} component={PersonalDataSheet}/>
            </Switch>
          </div>
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    progress: state.completeRegistration.progress,
    rawImage: state.completeRegistration.picture.rawImage,
    croppedImage: state.completeRegistration.picture.croppedImage,
    showModal: state.completeRegistration.picture.ui.showModal,
    employeeId: state.authentication.employeeId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    replaceProgress: (value, employeeId) => dispatch(replaceProgress(value, employeeId))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompleteRegistration));
