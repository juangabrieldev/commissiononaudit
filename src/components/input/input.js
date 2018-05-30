import React, {Component} from 'react';

import Aux from '../auxillary/auxillary';

import styles from './input.scss';

class Input extends Component {
  state = {
    value: this.props.value,
    borderColor: '#cdcdcd',
    didFocus: false,
    onFocus: false,
    show: false
  };

  onChangeHandler = e => {
    this.setState({value: e.target.value});
    this.props.onChangeHandler(e);
  };

  onFocus = () => {
    this.setState({borderColor: '#9b9b9b', onFocus: true});
  };

  onBlur = () => {
    this.setState({borderColor: '#cdcdcd', didFocus: true, onFocus: false});
  };

  render() {
    let border = '';

    if(this.props.valid) {
      border = 'solid 1px #30AF60'
    } else if(this.props.error) {
      border = 'solid 1px #ff6975'
    } else {
      border = 'solid 1px ' + this.state.borderColor
    }

    return (
      <Aux>
        <div
          className={styles.input}
          style={{
            border, //checks if the input is valid
            width: this.props.width
          }}>
          <label
            className={this.state.value.length > 0 ? styles.shown : ''}
            style={{color: this.props.valid ? '#30AF60' : null}}
            htmlFor={this.props.name}>
              {this.props.name}
          </label>
          <input
            style={{
              width: (this.props.type === 'password' && this.state.value.length > 0 ?
                      this.props.width - 48 : ''
              )
            }}
            autoFocus={this.props.autofocus}
            onChange={e => this.onChangeHandler(e)}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            type={this.state.show ? 'text' : this.props.type}
            id={this.props.name}
            placeholder={this.props.name}
            value={this.state.value}/>
          {
            this.props.type === 'password' && this.state.value.length > 0 ?
              <div
                className={styles.show}
                onMouseDown={() => this.setState({show: !this.state.show})}
                onMouseUp={() => this.setState({show: !this.state.show})}>
                <p style={{
                  transition: '.1s',
                  color: this.state.show ? '#3268f0' : '',
                  opacity: this.state.show ? 1 : ''
                }}>SHOW</p>
              </div> :
              null
          }
          {/*{*/}
            {/*this.props.valid ?*/}
              {/*<div className={`${styles.validationLabel} ${styles.valid}`}>*/}
                {/*<p>{this.props.validationMessage}</p>*/}
              {/*</div> :*/}
              {/*<div className={`${styles.validationLabel} ${styles.error}`}>*/}
                {/*<p>{this.props.validationMessage}</p>*/}
              {/*</div>*/}
          {/*}*/}
        </div>
      </Aux>
    );
  }
}

export default Input;
