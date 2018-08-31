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
          }, this.viewMore)
        }
      })
  };

  componentDidMount = () => {
    this.fetch();
  };

  viewMore = () => {
    if(this.state.otherData.length > 9) {
      this.clusters = this.state.otherData.slice(0, 9).map((data, i, a) => (
        <Fragment key={data.key}>
          <Col xs={2}>
            <Link to={this.props.location.pathname + '/clusters/' + data.clusternumber}>
              <div className={viewOfficeStyles.fields}>
                <p>CLUSTER {data.clusternumber}</p>
              </div>
            </Link>
          </Col>
          {
            i === a.length - 1 ?
              <Fragment>
                <Col xs={2}>
                  <div style={{marginTop: 15, padding: 15}}>
                    <p onClick={this.onClickViewMore} style={{cursor: 'pointer', margin: 0, fontSize: 12, textAlign: 'center', color: '#4688FF'}}>VIEW MORE...</p>
                  </div>
                </Col>
                <Col xs={6} md={4}>
                  <div className={viewOfficeStyles.fields + ' ' + viewOfficeStyles.add}>
                    <p>+&nbsp;&nbsp;ADD A <Link to="/heys">SINGLE</Link> OR <Link to="/hey">MULTIPLE CLUSTERS</Link></p>
                    {
                      this.forceUpdate() //really really bad code
                    }
                  </div>
                </Col>
              </Fragment> :
              null
          }
        </Fragment>
      ));
    } else {
      this.onClickViewMore()
    }
  };

  onClickViewMore = () => {
    this.clusters = this.state.otherData.map((data, i, a) => (
      <Fragment key={data.key}>
        <Col xs={2}>
          <Link to={this.props.location.pathname + '/clusters/' + data.clusternumber}>
            <div className={viewOfficeStyles.fields}>
              <p>CLUSTER {data.clusternumber}</p>
            </div>
          </Link>
        </Col>
        {
          i === a.length - 1 ?
            <Fragment>
              <Col xs={6} md={4}>
                <div className={viewOfficeStyles.fields + ' ' + viewOfficeStyles.add}>
                  <p>+&nbsp;&nbsp;ADD A <Link to="/heys">SINGLE</Link> OR <Link to="/hey">MULTIPLE CLUSTERS</Link></p>
                  {
                    this.forceUpdate() //really really bad code
                  }
                </div>
              </Col>
            </Fragment> :
            null
        }
      </Fragment>
    ));
  };

  render() {
    const description = (
      this.state.description.length > 0 ?
      parse(this.state.description) :
        'No description available'
    );

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
              <div className={univStyles.groupOfFields}>
                <p className={univStyles.title}>BASIC INFORMATION</p>
                <div className={univStyles.fields} style={{display: 'inline-block'}}>
                  <p className={univStyles.title}>OFFICE NAME</p>
                  <p>{this.state.officeName}</p>
                </div>
                <div className={univStyles.fields} style={{width: '30%'}}>
                  <p className={univStyles.title}>DATE CREATED</p>
                  <p>{moment(this.state.dateCreated).format('MMMM DD, YYYY') + ' at ' + moment(this.state.dateCreated).format('h:mm A')}</p>
                </div>
                <div className={univStyles.fields} style={{width: '100%'}}>
                  <p className={univStyles.title}>DESCRIPTION</p>
                  <p className={viewOfficeStyles.description}>{description}</p>
                </div>
              </div>
              <div className={viewOfficeStyles.groupOfFields}>
                <p>CLUSTERS</p>
                <div className={viewOfficeStyles.clusters}>
                  <Container fluid style={{padding: 0, marginTop: '-15px'}}>
                    <Row>
                      {this.clusters}
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
