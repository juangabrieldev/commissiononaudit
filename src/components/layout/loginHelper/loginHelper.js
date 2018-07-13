import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'

class LoginHelper extends Component {
  state = {};

  render() {
    // if(this.props.location.pathname.includes('/announcements')) {
    //   this.props.history.push('/get-started/login?redirect=' + this.props.location.pathname)
    // }
    return null;
  }
}

export default withRouter(LoginHelper);
