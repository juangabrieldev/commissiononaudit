import React, {Component} from 'react';
import axios from 'axios';
import parse from 'html-react-parser';

import styles from './departments.scss';
import univStyles from '../../styles.scss'
import viewDepartmentStyles from './viewDepartment.scss'

import { departments } from "../../../../api";
import moment from 'moment';

class ViewDepartment extends Component {
  state = {
    departmentHead: '',
    departmentName: '',
    description: '',
    dateCreated: '',
    acronym: '',
    color: ''
  };

  fetch = () => {
    axios.get(departments.view + '?slug=' + this.props.match.params.slug)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            departmentHead: res.data.data[0].departmenthead,
            departmentName: res.data.data[0].departmentname,
            description: res.data.data[0].description,
            dateCreated: res.data.data[0].datecreated,
          })
        }
      })
  };

  otherDepartments = () => {
    axios.get(departments.get)
      .then(res => {

      })
  };

  componentDidMount = () => {
    this.fetch();
  };

  render() {
    return (
      <div className={viewDepartmentStyles.main}>
        <div className={viewDepartmentStyles.firstRow}>
          <div className={univStyles.form}>
            <div className={univStyles.header}>
              <p>View Department</p>
              <p className={univStyles.formControl}>Edit</p>
            </div>
            <div className={univStyles.formBody}>
              <div className={viewDepartmentStyles.view}>
                <div className={viewDepartmentStyles.column}>
                  <div className={viewDepartmentStyles.fields}>
                    <p>DEPARTMENT NAME</p>
                    <p>{this.state.departmentName}</p>
                  </div>
                  <div className={viewDepartmentStyles.fields}>
                    <p>DATE CREATED</p>
                    <p>{moment(this.state.dateCreated).format('MMMM DD, YYYY') + ' at ' + moment(this.state.dateCreated).format('h:mm A')}</p>
                  </div>
                </div>
                <div className={viewDepartmentStyles.column}>
                  <div className={viewDepartmentStyles.fields}>
                    <p>DESCRIPTION</p>
                    <p>{parse(this.state.description)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={univStyles.form}>
            <div className={univStyles.header}>
              <p>Other Departments</p>
            </div>
            <div className={univStyles.formBody}>
              <div style={{height: 200}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewDepartment;
