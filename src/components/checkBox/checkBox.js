import React, {Component} from 'react';

import styles from './checkBox.scss';

class CheckBox extends Component {
  state = {
    value: false
  };

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.setState({value: !this.state.value})
    }
  };

  render() {
    return (
      <div
        onClick={() => {this.setState({value: !this.state.value})}}
        onKeyPress={e => this.onKeyPress(e)}
        className={`${styles.checkbox} ` + (this.state.value ? `${styles.selected}` : '')}
        tabIndex={0}>
        <div className={styles.check}/>
      </div>
    );
  }
}

export default CheckBox;
