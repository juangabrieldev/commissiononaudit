import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';

import styles from './notFound.scss';

const notFound = ({link, onClick}) =>
  <DocumentTitle title="Page not found">
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.title}>Sorry, this page is not found.</p>
        <p className={styles.sub}>The link you followed may be broken or may have been deleted.</p>
        <div style={{textAlign: 'center'}}>
          <Link onClick={onClick} to={link}>Go home.</Link>
        </div>
      </div>
    </div>
  </DocumentTitle>;


export default notFound;
