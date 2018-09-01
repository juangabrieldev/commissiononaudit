import React, {Component} from 'react';
import DatePicker from 'react-datepicker';

import './styles.scss';

class datePicker extends Component {
  state = {};

  render() {
    return (
      <DatePicker placeholderText={this.props.placeholder} selected={this.props.selected} onChange={this.props.onChange}/>
    );
  }
}

export default datePicker;
