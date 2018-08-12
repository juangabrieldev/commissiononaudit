import React, {Component, Fragment} from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import Title from 'react-document-title';
import { Container, Row, Col, setConfiguration } from 'react-grid-system';
import { Link } from "react-router-dom";

import styles from './office.scss';
import univStyles from '../../styles.scss'
import viewOfficeStyles from './viewOffice.scss'

import { office } from "../../../../api";
import moment from 'moment';

setConfiguration({ gutterWidth: 15 });

class ViewOffice extends Component {
  state = {
    officeName: '',
    description: '',
    dateCreated: '',
    acronym: '',
    otherData: []
  };

  fetch = () => {
    axios.get(office.view + '?slug=' + this.props.match.params.slug)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            officeName: res.data.data[0].officename,
            description: res.data.data[0].description,
            dateCreated: res.data.data[0].datecreated,
            otherData: res.data.data
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
    const clusters = this.state.otherData.map((data, i, a) => (
      <Fragment>
        <Col md={2} key={data.key}>
          <Link to={this.props.location.pathname + '/clusters/' + data.clusternumber}>
            <div className={viewOfficeStyles.fields}>
              <p>CLUSTER {data.clusternumber}</p>
            </div>
          </Link>
        </Col>
        {
          i === a.length - 1 ?
            <Col md={4}>
              <div className={viewOfficeStyles.fields + ' ' + viewOfficeStyles.add}>
                <p>+&nbsp;&nbsp;ADD A <Link to="/heys">SINGLE</Link> OR <Link to="/hey">MULTIPLE CLUSTERS</Link></p>
              </div>
            </Col> :
            null
        }
      </Fragment>
    ));

    const description = (
      this.state.description.length > 0 ?
      parse(this.state.description) :
        'No description available'
    );

    console.log(this.state);

    return (
      <div className={viewOfficeStyles.main}>
        <Title title={this.state.officeName}/>
        <div className={univStyles.form}>
          <div className={univStyles.header}>
            <p>View office</p>
            <Link to={this.props.location.pathname + '/edit'} className={univStyles.formControl}>Edit</Link>
          </div>
          <div className={univStyles.formBody}>
            <div className={viewOfficeStyles.view}>
              <div className={viewOfficeStyles.groupOfFields}>
                <p>BASIC INFORMATION</p>
                <div className={viewOfficeStyles.fields} style={{width: '30%'}}>
                  <p>OFFICE NAME</p>
                  <p>{this.state.officeName}</p>
                </div>
                <div className={viewOfficeStyles.fields} style={{width: '30%'}}>
                  <p>DATE CREATED</p>
                  <p>{moment(this.state.dateCreated).format('MMMM DD, YYYY') + ' at ' + moment(this.state.dateCreated).format('h:mm A')}</p>
                </div>
                <div className={viewOfficeStyles.fields} style={{width: '100%'}}>
                  <p>DESCRIPTION</p>
                  <p className={viewOfficeStyles.description}>{description}</p>
                </div>
              </div>
              <div className={viewOfficeStyles.groupOfFields} style={{}}>
                <p>CLUSTERS</p>
                <div className={viewOfficeStyles.clusters}>
                  <Container fluid style={{padding: 0, marginTop: '-8px'}}>
                    <Row>
                      {clusters}
                    </Row>
                  </Container>
                </div>
              </div>
              <div className={viewOfficeStyles.groupOfFields} style={{}}>
                <p>JOBS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewOffice;
