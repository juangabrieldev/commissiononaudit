import React, {Component} from 'react';
import Count from 'react-countup';

import styles from './progressBar.scss';

class ProgressBar extends Component {
  state = {
    old: 0,
    new: 0
  };

  componentWillReceiveProps = props => {
    this.setState({
      old: this.state.new,
      new: props.progress
    })
  };

  render() {
    return (
      <div className={styles.progress}>
        <div className={styles.progressContainer}>
          <div className={styles.container}>
            <div className={styles.percentageContainer}>
              <p style={{
                paddingLeft: this.state.new <= 98 ? `${this.state.new - 2}%` : 'calc(100% - 38px)'
              }}><Count start={this.state.old} end={this.state.new} duration={1}/>%</p>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.value} style={{width: `${this.state.new}%`}}/>
              <div className={styles.background}/>
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div>
            <p className={styles.title}>Status of your application</p>
          </div>

          <p className={styles.details}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dapibus justo volutpat odio commodo volutpat. </p>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
