import React from 'react';
import { Link } from 'react-router-dom';

import styles from './alert.scss'

const alert = props =>
  <div className={styles[props.type] + ' ' + styles.alert}>
    <p>{props.message} {
      props.employeeId != null ?
        <span>Click <Link to={`/get-started/register?q=${props.employeeId}`}>here</Link> to register.</span> :
        null
    }</p>
  </div>;

export default alert;