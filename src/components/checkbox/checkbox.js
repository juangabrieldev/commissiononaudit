import React, {Component} from 'react';

import styles from './checkbox.scss';

class Checkbox extends Component {
  state = {
    value: false
  };

  render() {
    return (
      <div
        onClick={() => {this.setState({value: !this.state.value})}}
        className={`${styles.checkbox} ` + (this.state.value ? `${styles.selected}` : '')}>
        <div className={styles.check}/>
      </div>
    );
  }
}

export default Checkbox;
