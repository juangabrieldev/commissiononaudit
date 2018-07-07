import React from 'react';

import styles from './button.scss';

const button = props => {
  let style = '';
  const classNames = () => {
    // eslint-disable-next-line
    if(props.classNames) {
      props.classNames.map(item => {
        style += `${styles[item]} `;
      });

      return style;
    }
  };

  return (
    <input
      onClick={e => props.onClick(e)}
      disabled={props.disabled}
      type={props.type || 'button'}
      style={{width: props.width}}
      className={`${styles.btn} ${classNames()}`}
      value={props.name}/>
  )
};

export default button;
