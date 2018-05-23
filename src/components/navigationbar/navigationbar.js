import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import styles from './navigationbar.scss';

class Navigationbar extends Component {
  state = {
    n: styles.navigationBar,
    activeTab: this.props.location.pathname + this.props.location.hash,
  };

  componentDidMount = () => {
    if(this.props.location.pathname.includes('/get-started')) {
      this.setState({n: `${styles.navigationBar} ${styles.white}`})
    } else {
      this.setState({n: styles.navigationBar})
    }
  };

  componentWillReceiveProps = nextProps => {
    this.setState({activeTab: nextProps.location.pathname + nextProps.location.hash});

    if(nextProps.location.pathname.includes('/get-started')) {
      this.setState({n: `${styles.navigationBar} ${styles.white}`})
    } else {
      this.setState({n: styles.navigationBar})
    }
  };

  render() {
    return (
      <div className={this.state.n}>
        <div className={styles.inside}>
          <div className={styles.logo}>
            <p><Link to="/">PMS</Link></p>
          </div>
          <div className={styles.right}>
            <div className={styles.tabs}>
              {
                this.state.activeTab.includes('/get-started') ?
                  <div className={`${styles.tab} ${styles.active}`}>
                    <p><Link to="/get-started/login">Get started</Link></p>
                  </div> :
                  <div className={styles.tab}>
                    <p><Link to="/get-started/login">Get started</Link></p>
                  </div>
              }
              {
                this.state.activeTab === '/#features' ?
                  <div className={`${styles.tab} ${styles.active}`}>
                    <p><Link to="/#features">Features</Link></p>
                  </div> :
                  <div className={styles.tab}>
                    <p><Link to="/#features">Features</Link></p>
                  </div>
              }
              {
                this.state.activeTab === '/#about-us' ?
                  <div className={`${styles.tab} ${styles.active}`}>
                    <p><Link to="/#about-us">About us</Link></p>
                  </div> :
                  <div className={styles.tab}>
                    <p><Link to="/#about-us">About us</Link></p>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigationbar;
