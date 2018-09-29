import React, { PureComponent } from 'react';
import Tooltip from 'react-tooltip';

import Aux from '../auxillary/auxillary';

import styles from './input.scss';

import checked from '../../assets/ui/checked.svg';
import warning from '../../assets/ui/warning.svg';

class Input extends PureComponent {
  state = {
    value: this.props.value != null ? this.props.value : '',
    borderColor: '#d7d7d7',
    didFocus: false,
    onFocus: false,
    show: false,
    characterLimit: this.props.characterLimit
  };

  onChangeHandler = e => {
    if(this.props.disabledTyping || e.target.value.length > this.props.characterLimit) {
      return 0;
    }
    this.props.onChangeHandler(e);
  };

  componentDidUpdate = prev => {
    if(prev.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        characterLimit: this.props.characterLimit - this.props.value.length
      })
    }
  };

  onFocus = () => {
    if(this.props.passwordStrength === null || this.props.passwordStrength === undefined) {
      this.setState({borderColor: '#aaaaaa', onFocus: true});
    }

    if(this.props.onFocus != null) {
      this.props.onFocus();
    }
  };

  onBlur = () => {
    if(this.props.passwordStrength === null || this.props.passwordStrength === undefined) {
      this.setState({borderColor: '#d7d7d7', didFocus: true, onFocus: false});
    }

    if(this.props.onBlur != null) {
      this.props.onBlur();
    }
  };

  componentWillReceiveProps = next => {
    switch(next.passwordStrength) {
      case 0:
        this.setState({borderColor: '#FF6975'});
        break;
      case 1:
        this.setState({borderColor: '#F38415'});
        break;
      case 2:
        this.setState({borderColor: '#F3C715'});
        break;
      case 3:
        this.setState({borderColor: '#3268F0'});
        break;
      case 4:
        this.setState({borderColor: '#30AF60'});
        break;
    }

    if(this.props.name === 'Username') {
      this.setState({value: next.value}, () => {
        const event = new Event('change', {bubbles: true});
          this.refs[this.props.name].value = next.value;
          this.refs[this.props.name].dispatchEvent(event);
      });
    }
  };

  render() {
    let { width } = this.props;
    let border = 'solid 1px ' + this.state.borderColor;
    let style = styles.input + (this.props.hideSpin ? ' ' + styles.hideSpin : '');
    const passwordStrengthWidth = this.props.passwordStrength === 0 ? '20%' : `${((this.props.passwordStrength + 1) * 2) * 10}%`;

    if(this.props.valid) {
      border = 'solid 1px #30AF60';
      style = style + ' ' + styles.valid
    } else if(this.props.valid === false && this.state.value.length > 0) {
      border = 'solid 1px #ff6975';
      style = style + ' ' + styles.error
    }

    if(this.props.type === 'password' && this.state.value.length > 0) {
      border = 'solid 1px ' + this.state.borderColor
    }

    return (
      <div
        data-tip={this.props.validationMessage}
        className={style}
        style={{border, width}}>
        <label
          className={this.state.value.length > 0 ? styles.shown : ''}
          style={{
            color: this.props.type === 'password' && this.props.passwordStrength && this.state.value.length > 0 ?
              this.state.borderColor :
              ''
          }}
          htmlFor={this.props.name}>
            {this.props.name}
        </label>
        {
          this.state.value.length > 0 && this.state.onFocus && this.props.characterLimit != null ?
            <div title={this.state.characterLimit + ' characters left.'} className={styles.characterLimit + (this.state.characterLimit === 0 ? ' ' + styles.characterLimitRed : '')}>
              <p>{this.state.characterLimit}</p>
            </div> :
            null
        }
        <input
          key={this.props.myKey}
          ref={this.props.name}
          style={{
            width: (this.props.type === 'password' && this.state.value.length > 0 ?
                    this.props.width - 40 : ''
            )
          }}
          autoFocus={this.props.autofocus}
          onChange={this.onChangeHandler}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          type={this.state.show ? 'text' : this.props.type}
          maxLength={this.props.maxLength}
          id={this.props.name}
          placeholder={this.props.name}
          pattern={this.props.pattern}
          value={this.state.value}/>
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
          this.props.valid && this.state.value.length > 0  ?
            <div className={styles.validationLabel}>
              <Tooltip
                place="right"
                effect="solid"/>
              {
                this.props.type !== 'password' ?
                  <img src={checked} alt=""/> :
                  null
              }
            </div> :
            <Aux>
              {
                this.props.valid === false && this.state.value.length > 0 ?
                  <div className={styles.validationLabel}>
                    <Tooltip
                      place="right"
                      effect="solid"/>
                    {
                      this.props.type !== 'password' ?
                        <img src={warning} alt=""/> :
                        null
                    }
                  </div> :
                  null
              }
            </Aux>
        }
        {
          this.props.type === 'password' ?
          <div className={styles.passwordStrengthContainer}>
            <div style={{
              width: this.state.value && this.props.passwordStrength != null ?
                passwordStrengthWidth :
                0,
              backgroundColor: this.state.borderColor
            }}/>
          </div> :
            null
        }
      </div>
    );
  }
}

export default Input;
