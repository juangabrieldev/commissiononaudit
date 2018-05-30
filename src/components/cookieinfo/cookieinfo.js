import React, {Component} from 'react';

import styles from './cookieinfo.scss'

import cookies from '../../assets/ui/cookies.svg';

class Cookieinfo extends Component {
  state = {
    show: true
  };

  render() {
    return (
      this.state.show ?
        <div className={styles.container}>
          <div className={styles.sub}>
            <div className={styles.cookies}>
              <div className={styles.icon}>
                <img src={cookies} alt=""/>
              </div>
              <p>This website uses cookies to ensure you got the best experience.</p>
              <div onClick={() => this.setState({show: false})} className={styles.button}>
                <p>GOT IT!</p>
              </div>
            </div>
          </div>
        </div> :
      null
    );
  }
}

export default Cookieinfo;
