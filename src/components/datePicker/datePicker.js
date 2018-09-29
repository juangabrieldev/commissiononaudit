import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import './styles.scss';
import styles from "./own.scss";

const datePicker = props => {
  const selected = !!props.selected ? moment(props.selected) : null;

  return (
    <div style={{position: 'relative', ...props.style}}>
      <label
        className={props.selected != null ? styles.shown : ''}>
        {props.placeholder}
      </label>
      <DatePicker
        openToDate={selected != null ? selected : (props.openToDate != null ? moment(props.openToDate) : null)}
        fixedHeight
        showYearDropdown={props.showYearDropdown}
        popperPlacement={props.popperPlacement}
        popperModifiers={props.popperModifiers}
        dateFormat="LL"
        selected={selected}
        minDate={props.minDate}
        maxDate={props.maxDate}
        placeholderText={props.placeholder}
        onChange={props.onChange}/>
    </div>
  );
};

export default datePicker;
