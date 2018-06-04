import React from 'react';
import DocumentTitle from 'react-document-title';

import styles from './notFound.scss';

const notFound = () =>
  <DocumentTitle title="Page not found">
    <div className={styles.main}>
      <p>404</p>
      <p>Take me back <a href="/">home.</a></p>
    </div>
  </DocumentTitle>;


export default notFound;
