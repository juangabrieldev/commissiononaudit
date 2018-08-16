import ReactDropdown from 'react-dropdown'

import './styles.scss';

import React, {Component, Fragment} from 'react';

class Dropdown extends Component {
  render() {
    console.log(this.props)
    return (
      <div style={{minWidth: this.props.width}}>
        <ReactDropdown isClearable isMulti={this.props.isMulti} isSearchable={this.props.isSearchable} onChange={this.props.onChange} value={this.props.value} placeholderClassName={(this.props.didSelect ? 'Dropdown-didselect' : '')} options={this.props.options} placeholder={this.props.placeholder}/>
      </div>
    );
  }
}

export default Dropdown;