import React, { PureComponent } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import styles from './textArea.scss';

class TextArea extends PureComponent {
  state = {
    value: '',
    borderColor: '#e1e1e1',
    onFocus: false,
    show: false,
    characterLimit: this.props.characterLimit,
    move: false
  };

  onFocus = () => {
    this.setState({borderColor: '#aaaaaa', onFocus: true});
  };

  onBlur = () => {
    this.setState({borderColor: '#e1e1e1', onFocus: false});
  };

  componentDidUpdate = prev => {
    if(prev.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        characterLimit: this.props.characterLimit - this.props.value.length
      });

      this.setState({
        move: this.refs.textarea.scrollHeight > this.refs.textarea.clientHeight
      });
    }
  };

  componentDidMount = () => {
    this.setState({
      move: this.refs.textarea.scrollHeight > this.refs.textarea.clientHeight
    });
  };

  onResize = () => {
    this.setState({
      move: this.refs.textarea.scrollHeight > this.refs.textarea.clientHeight
    });
  };

  onChangeHandler = e => {
    if(e.target.value.length > this.props.characterLimit) {
      return 0;
    }

    this.props.onChangeHandler(e);
  };

  render() {
    return (
      <div className={styles.textAreaDiv} style={{borderColor: this.state.borderColor}}>
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <label
          className={this.state.value.length > 0 ? styles.shown : ''}
          htmlFor={this.props.name}>
          {this.props.name}
        </label>
        {
          this.state.value.length > 0 && this.state.onFocus && this.props.characterLimit != null ?
            <div title={this.state.characterLimit + ' characters left.'} className={styles.characterLimit + (this.state.characterLimit === 0 ? ' ' + styles.characterLimitRed : ' ') + (this.state.move ? styles.move : '')}>
              <p>{this.state.characterLimit}</p>
            </div> :
            null
        }
        <textarea
          autoFocus={this.props.autoFocus}
          value={this.props.value}
          ref="textarea"
          onChange={e => this.onChangeHandler(e)}
          onFocus={this.onFocus} onBlur={this.onBlur}
          name={this.props.name}
          rows="6"
          placeholder={this.props.name}>

        </textarea>
      </div>
    );
  }
}

export default TextArea;
