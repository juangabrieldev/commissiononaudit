import React, {Component} from 'react';
import Tooltip from 'react-tooltip';

import styles from './numeric.scss';
import stringquery from "stringquery";

class Numeric extends Component {
  state = {
    value: 0,
    focused: false
  };

  handleClickOutside = e => {
    if (this.refs.numeric && !this.refs.numeric.contains(e.target)) {
      this.setState({focused: false})
    } else {
      this.setState({focused: true})
    }
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  subtract = () => {
    if(this.state.value > 0) {
      this.setState({value: this.state.value - 1}, () => {
        this.onChangeHandler(this.state.value)
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

  render() {
    return (
      <div style={{width: this.props.width}} className={styles.numeric + (this.state.focused ? ' ' + styles.focused : '')}>
        <label
          className={this.state.value > 0 ? styles.shown : ''}
          htmlFor={this.props.name}>
          {this.props.name}
        </label>
        {
          this.state.value > 0 ?
            <p>{this.state.value}</p> :
            <p className={styles.placeholder}>{this.props.name}</p>
        }
        <div ref="numeric" className={styles.buttons}>
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

