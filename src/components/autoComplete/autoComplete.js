import React, {Component} from 'react';

import Input from '../input/input';

import styles from './styles.scss';

class AutoComplete extends Component {
  state = {
    items: [
      {
        label: 'Bachelor of Science in Accountancy'
      },
      {
        label: 'Bachelor of Science in Information Technology'
      }
    ],
    value: '',
    showSuggestions: false,
    cursor: 0,
    selected: ''
  };

  onChangeHandler = e => {
    const value = e.target.value;

    this.setState({value})
  };

  onFocusHandler = () => {
    this.setState({showSuggestions: true, cursor: 0});

    document.addEventListener('keydown', this.select);
  };

  onBlurHandler = () => {
    document.removeEventListener('keydown', this.select);
  };

  select = e => {
    switch(e.which) {
      case 38: {
        if(this.state.cursor === 0) {
          this.setState({cursor: this.state.items.length})
        } else {
          this.setState({cursor: this.state.cursor - 1})
        }

        break;
      }

      case 40: {
        if(this.state.cursor + 1 <= this.state.items.length) {
          this.setState({cursor: this.state.cursor + 1})
        } else {
          this.setState({cursor: 0})
        }

        break;
      }

      case 13: {
        if(this.state.cursor !== 0) {
          this.setState({
            value: this.state.items[this.state.cursor - 1].label,
            showSuggestions: false,
            cursor: 0
          })
        }
      }
    }
  };

  onSelect = i => {
    this.setState({
      value: this.state.items[i].label,
      showSuggestions: false,
      cursor: 0
    })
  };

  render() {
    return (
      <div ref="autoComplete" className={styles.autoComplete}>
        <Input onFocus={this.onFocusHandler} value={this.state.value} onChangeHandler={this.onChangeHandler} name={this.props.name}/>
        {
          this.state.showSuggestions ?
            <div className={styles.suggestions}>
              {
                this.state.items.map((e, i) => {
                  return <p onClick={() => this.onSelect(i)} key={i} className={(i + 1 === this.state.cursor ? styles.selected : '')}>{e.label}</p>
                })
              }
            </div> :
            null
        }
      </div>
    );
  }
}

export default AutoComplete;
