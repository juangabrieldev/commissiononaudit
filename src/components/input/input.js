import React, {Component} from 'react';

import Aux from '../auxillary/auxillary';

import styles from './input.scss';

class Input extends Component {
  state = {
    value: '',
    borderColor: '#cdcdcd',
    didFocus: false,
    onFocus: false
  };

  onChangeHandler = e => {
    this.setState({value: e.target.value});
    this.props.onChangeHandler(e)
  };

  onFocus = () => {
    this.setState({borderColor: '#9b9b9b', onFocus: true});
  };

  onBlur = () => {
    this.setState({borderColor: '#cdcdcd', didFocus: true, onFocus: false})
  };

  render() {
    return (
      <Aux>
        <div
          style={{width: this.props.width, borderColor: this.state.borderColor}}
          className={`${styles.div} ` +
            (this.state.value.length >= 1 ? `${styles.hasValue} ` : ' ') +
            (this.props.isValid ? styles.valid : '')}>
          <label
            className={(this.props.error || (this.state.didFocus && this.state.value.length < this.props.requiredChar) ? styles.labelError : '') +
                       (this.props.isValid ? styles.labelValid : '')
            }
            htmlFor={this.props.name}>
            {this.props.name}
          </label>
          <input
            className={(this.props.error || (this.state.didFocus && this.state.value.length < this.props.requiredChar) ? styles.error : '') +
                       (this.props.valid ? styles.valid : '')
            }
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyUp={this.props.onKeyUp}
            autoFocus={this.props.autofocus}
            onChange={e => this.onChangeHandler(e)}
            name={this.props.name}
            type={this.props.type}
            placeholder={this.props.name}/>
          {
            this.props.error || (this.state.didFocus && this.state.value.length < this.props.requiredChar) ?
              <div className={styles.message} style={{left: this.props.width + 8}}>
                <p className={styles.error}>{this.props.errorMessage}</p>
              </div> :
              null
          }
          {
            this.props.isValid ?
              <div className={styles.validLabel}>
                <p>{this.props.validMessage}</p>
              </div> :
              null
          }
        </div>
      </Aux>
    );
  }
}

export default Input;
