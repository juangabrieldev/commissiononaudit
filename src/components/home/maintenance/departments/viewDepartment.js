import React, {Component} from 'react';
import axios from 'axios';

import styles from './departments.scss';
import univStyles from '../../styles.scss'

import { departments } from "../../../../api";

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
            color: res.data.data[0].color,
            acronym: res.data.data[0].departmentname.toUpperCase().match(/\b(\w)/g)
          })
        }
      })
  };

  componentDidMount = () => {
    this.fetch();
  };

  render() {
    return (
      <div className={univStyles.form}>
        <div className={univStyles.header}>
          <p>View Department</p>
          <p className={univStyles.formControl}>Edit</p>
        </div>
        <div className={univStyles.formBody}>
          <div style={{height: 500, padding: 12}}>
            <div className={styles.departmentPicture} style={{background: this.state.color}}>
              <p>{this.state.acronym[0]}{this.state.acronym[1]}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewDepartment;
