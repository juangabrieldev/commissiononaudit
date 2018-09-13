import React, {Component} from 'react';

import NotFoundEnabler from '../../../notFound/notFoundEnabler';

class viewOpportunity extends Component {
  state = {
    jobOpportunity: {}
  };

  fetch = () => {

  };

  render() {
    return <NotFoundEnabler link="/announcements/job-opportunities"/>
  }
}

export default viewOpportunity;
