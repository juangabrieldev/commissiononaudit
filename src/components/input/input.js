import React, {Component} from 'react';
import Tooltip from 'react-tooltip';

import Aux from '../auxillary/auxillary';

import styles from './input.scss';

import checked from '../../assets/ui/checked.svg';
import warning from '../../assets/ui/warning.svg';

class Input extends Component {
  state = {
    value: this.props.value,
    borderColor: '#cdcdcd',
    didFocus: false,
    onFocus: false,
    show: false
  };

  onChangeHandler = e => {
    this.setState({value: e.target.value}, () => {
      if(this.props.type === 'password' && this.state.value.length === 0) {
        this.setState({show: false})
      }
    });
    this.props.onChangeHandler(e);
  };

  onFocus = () => {
    this.setState({borderColor: '#9b9b9b', onFocus: true});
  };

  onBlur = () => {
    this.setState({borderColor: '#cdcdcd', didFocus: true, onFocus: false});
  };

  render() {
    let border = 'solid 1px ' + this.state.borderColor;
    let style = styles.input + (this.props.hideSpin ? ' ' + styles.hideSpin : '');

    if(this.props.valid) {
      border = 'solid 1px #30AF60';
      style = style + ' ' + styles.valid
    } else if(this.props.valid === false) {
      border = 'solid 1px #ff6975';
      style = style + ' ' + styles.error
    }

    return (
      <div
        data-tip={this.props.validationMessage}
        className={style}
        style={{
          border, //checks if the input is valid
          width: this.props.width
        }}>
        <label
          className={this.state.value.length > 0 ? styles.shown : ''}
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
          maxLength={this.props.maxLength}
          id={this.props.name}
          placeholder={this.props.name}
          pattern={this.props.pattern}
          value={this.props.value}/>
        {
          this.props.type === 'password' && this.state.value.length > 0 ?
            <div
              className={styles.show + (this.props.valid || this.props.valid === false ? ' ' + styles.valid : '')}
              onClick={() => this.setState({show: !this.state.show})}>
              <p>{this.state.show ? 'HIDE' : 'SHOW'}</p>
            </div> :
            null
        }
        {
          this.props.valid && this.state.value.length > 0 ?
            <div className={styles.validationLabel}>
              <Tooltip place="right" effect="solid"/>
              <img src={checked} alt=""/>
            </div> :
            <Aux>
              {
                this.props.valid === false && this.state.value.length > 0 ?
                  <div className={styles.validationLabel}>
                    <Tooltip place="right" effect="solid"/>
                    <img src={warning} alt=""/>
                  </div> :
                  null
              }
            </Aux>
        }
      </div>
    );
  }
}

export default Input;
