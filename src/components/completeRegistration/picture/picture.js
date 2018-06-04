import React, {Component} from 'react';

import styles from './picture.scss';

import Button from '../../button/button'

import avatar from '../../../assets/ui/avatar.svg';

class Picture extends Component {
  state = {};

  render() {
    return (
      <div className={styles.form}>
        <div className={styles.title}>
          <p><strong>Choose</strong> your picture</p>
        </div>
        <div className={styles.container}>
          <img src={avatar} height={200} alt=""/>
          <p><span onClick={() => window.alert('HEY!')}>Browse</span> for an image</p>
        </div>
        <div className={styles.bottom}>
          <div className={styles.helper}>
            <p>*The picture you upload will be attached to your Personal Data Sheet</p>
          </div>
          <div className={styles.button}>
            <Button width={100} name="Next" classNames={['primary']}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Picture;
