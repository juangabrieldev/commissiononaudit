import React, {Component, Fragment} from 'react';
import ReactSelect from 'react-select';
import _ from 'lodash';

import './styles.scss';
import styles from './anotherStyles.scss';

class Select extends Component {
  customStyles = {
    control: (base, state) => {
      return {
        ...base,
        borderRadius: 2,
        background: state.isDisabled? '#f0f0f0' : 'white',
        minHeight: 40,
        borderColor: state.isFocused ? '#aaaaaa' : '#e1e1e1',
        boxShadow: 'none',
      }
    },
    placeholder: base => ({
      ...base,
      fontWeight: 400,
      fontSize: 14,
      color: '#b3b3b3'
    }),
    menu: (base, state) => {
      return {
        ...base,
        zIndex: 2,
        borderRadius: 2,
        border: 'solid 1px',
        borderColor: state.isFocused ? '#aaaaaa' : '#e1e1e1',
        boxShadow: 'none'
      }
    },
    valueContainer: base => ({
      ...base,
      transform: 'translateY(1px)'
    }),
  };

  onChangeHandler = o => {
    this.props.onChangeHandler(o)
  };

  render = () => {
    let show;

    if(Array.isArray(this.props.value)) {
      show = this.props.value.length > 0;
    } else {
      show = this.props.value != null;
    }

    return (
      <div className={styles.select}>
        <span className={show ? styles.shown: ''}>{this.props.placeholder}</span>
        <ReactSelect
          value={this.props.value}
          onChange={this.onChangeHandler}
          classNamePrefix="react-select"
          styles={this.customStyles}
          placeholder={this.props.placeholder}
          isMulti={this.props.isMulti}
          isClearable={this.props.isClearable}
          isGroup={this.props.isGroup}
          isDisabled={this.props.isDisabled}
          options={this.props.options} />
      </div>
    )
  }
}

export default Select;