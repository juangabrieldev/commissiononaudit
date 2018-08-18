import React, {Component, Fragment} from 'react';
import produce from 'immer';

import styles from './styles.scss';

import icon from '../../assets/ui/selectDownArrow.svg';

class Select extends Component {
  state = {
    isFocused: false,
    isOpen: false,
    selected: []
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleClickOutside = e => {
    if (this.refs.select && !this.refs.select.contains(e.target)) {
      this.setState({isOpen: false});
    } else {
      this.setState({isOpen: true});
    }
  };

  menuOptionOnClick = item => {
    this.setState(produce(draft => {
      draft.selected.push(item)
    }))
  };

  render() {
    const comparisonArray = [...this.state.selected];

    const filteredArray = [];

    const options = this.props.options.map(option => {
      const filter = option.items.filter((item, i, a) => {
        console.log(i, comparisonArray.length);
        if( i < comparisonArray.length)
          return item.value !== comparisonArray[i].value;
        else return true
      });

      const itemsGrouped = filter.map((item, i) => (
        <p onClick={() => this.menuOptionOnClick(item)} style={{paddingLeft: 16}} className={styles.menuOption}>{item.label}</p>
      ));

      if(this.props.isGrouped) {
        return (
          <Fragment key={option.key}>
            <span className={styles.groupName}>{option.name}</span>
            {itemsGrouped}
          </Fragment>
        )
      }
    });

    const selected = this.state.selected.map(i => {
      return (
        <div onClick={() => 'hey'}>
          <p title={i.label}>{i.label}</p>
        </div>
      )
    });

    return (
      <div style={{width: this.props.width}}>
        <div tabIndex={0} ref="select" onBlur={() => this.setState({isFocused: false})} onFocus={() => this.setState({isFocused: true})} className={styles.select + (this.state.isFocused ? ' ' + styles.focused: '') + (this.state.isOpen ? ' ' + styles.menuContainerOpen : '')}>
          {
            this.state.selected.length > 0 ?
              <div className={styles.selectedOptionContainer}>
                {selected}
              </div> :
              null
          }
          <input placeholder={(this.state.selected.length > 0 ? '' : this.props.name)} type="text"/>
          <div className={styles.icon}>
            <img src={icon} height={10} alt=""/>
          </div>
          {
            this.state.isOpen ?
              <div className={styles.menuContainer}>
                {options}
              </div> :
              null
          }
        </div>
      </div>
    );
  }
}

export default Select;