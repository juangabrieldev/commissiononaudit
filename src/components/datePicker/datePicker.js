import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import './styles.scss';
import styles from "./own.scss";

class datePicker extends Component {
  render() {
    return (
      <div style={{position: 'relative', ...this.props.style}}>
        <label
          className={this.props.selected != null ? styles.shown : ''}>
          {this.props.placeholder}
        </label>
        <DatePicker
          fixedHeight
          scrollableYearDropdown
          showYearDropdown={this.props.showYearDropdown}
          popperPlacement={this.props.popperPlacement}
          popperModifiers={this.props.popperModifiers}
          dateFormat="LL"
          minDate={this.props.minDate}
          placeholderText={this.props.placeholder}
          selected={this.props.selected}
          onChange={this.props.onChange}/>
      </div>

    );
  }
}

export default datePicker;
