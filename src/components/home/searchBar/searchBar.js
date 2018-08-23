import React, {Component} from 'react';
import ReactSVG from 'react-svg';

import styles from './searchBar.scss';

import search from '../../../assets/ui/search.svg';

class SearchBar extends Component {
  state = {
    active: false,
  };

  render() {
    const classNames = styles.searchBar + ' ' + (this.state.active ? styles.active : '');

    return (
      <div className={classNames} style={this.props.style}>
        <div className={styles.inside}>
          <div className={styles.searchIcon}>
            <ReactSVG path={search} svgStyle={{fill: '#a5a5a5'}} svgClassName={styles.icon}/>
          </div>
          <div className={styles.input}>
            <input onChange={e => this.props.onChangeHandler(e)} value={this.props.value} onFocus={() => this.setState({active: true})} onBlur={() => this.setState({active: false})} type="text" placeholder={this.props.placeholder}/>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;
