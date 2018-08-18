import React, {Component} from 'react';
import Tooltip from 'react-tooltip';

import styles from './numeric.scss';
import stringquery from "stringquery";

class Numeric extends Component {
  state = {
    value: 0,
    focused: false
  };

  subtract = () => {
    if(this.state.value > 0) {
      this.setState({value: this.state.value - 1}, () => {
        this.onChangeHandler(this.state.value);
      })
    }
  };

  add = () => {
    this.setState({value: this.state.value + 1}, () => {
      this.onChangeHandler(this.state.value)
    })
  };

  onChangeHandler = v => {
    this.props.onChangeHandler(v)
  };

  onTypeHandler = e => {
    const reg = /^[0-9]*$/;

    if(reg.test(e.target.value)) {
      this.setState({value: parseInt(e.target.value, 10)}, () => {
        this.onChangeHandler(parseInt(this.state.value, 10))
      })
    }
  };

  render() {
    return (
      <div onBlur={() => this.setState({focused: false})} style={{width: this.props.width}} className={styles.numeric + (this.state.focused ? ' ' + styles.focused : '')}>
        <label
          className={this.state.value > 0 ? styles.shown : ''}
          htmlFor={this.props.name}>
          {this.props.name}
        </label>
        <input onFocus={() => this.setState({focused: true})} onChange={this.onTypeHandler} placeholder={this.props.name} type="text" value={this.state.value > 0 ? this.state.value : ''}/>
        <div className={styles.buttons}>
          <div onClick={this.subtract}>
            <p>-</p>
          </div>
          <div onClick={this.add}>
            <p>+</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Numeric;

