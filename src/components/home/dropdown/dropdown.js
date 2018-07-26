import React, { Component } from 'react';

import styles from './dropdown.scss';

class Dropdown extends Component {
  render() {
    return(
      <div
        className={styles.dropdown}
        style={{
          right: this.props.offset
        }}>
        <div className={styles.triangle} style={{right: this.props.triangleOffset}}/>
        {this.props.children}
      </div>
    )
  }
}

export default Dropdown;
