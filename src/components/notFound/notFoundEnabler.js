import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";

import * as actions from '../../store/actions/ui/actions'

class notFoundEnabler extends Component {
  componentDidMount = () => {
    this.props.enableNotFound(this.props.link)
  };

  render() {
    return null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    enableNotFound: link => dispatch({type: actions.ENABLE_NOT_FOUND, payload: {link}})
  }
};

export default connect(null, mapDispatchToProps)(notFoundEnabler);
