import React, {Component} from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import Title from 'react-document-title';

import styles from './office.scss';
import univStyles from '../../styles.scss'
import viewOfficeStyles from './viewOffice.scss'

import { office } from "../../../../api";
import moment from 'moment';

class ViewOffice extends Component {
  state = {
    departmentHead: '',
    departmentName: '',
    description: '',
    dateCreated: '',
    acronym: '',
    color: ''
  };

  fetch = () => {
    axios.get(office.view + '?slug=' + this.props.match.params.slug)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            departmentHead: res.data.data[0].departmenthead,
            officeName: res.data.data[0].departmentname,
            description: res.data.data[0].description,
            dateCreated: res.data.data[0].datecreated,
          })
        }
      })
  };

  otherDepartments = () => {
    axios.get(office.get)
      .then(res => {

      })
  };

  componentDidMount = () => {
    this.fetch();
  };

  render() {
    return (
      <div className={viewOfficeStyles.main}>
        <Title title={this.state.departmentName}/>
        <div className={univStyles.form}>
          <div className={univStyles.header}>
            <p>View office</p>
            <p className={univStyles.formControl}>Edit</p>
          </div>
          <div className={univStyles.formBody}>
            <div className={viewOfficeStyles.view}>
              <div className={viewOfficeStyles.fields}>
                <p>OFFICE NAME</p>
                <p>{this.state.departmentName}</p>
              </div>
              <div className={viewOfficeStyles.fields}>
                <p>DATE CREATED</p>
                <p>{moment(this.state.dateCreated).format('MMMM DD, YYYY') + ' at ' + moment(this.state.dateCreated).format('h:mm A')}</p>
              </div>
              <div className={viewOfficeStyles.fields}>
                <p>DESCRIPTION</p>
                <p>{parse(this.state.description)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewOffice;
