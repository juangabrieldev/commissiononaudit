import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import Layout from './components/layout/layout';

ReactDOM.render(<Layout />, document.getElementById('root'));
registerServiceWorker();
