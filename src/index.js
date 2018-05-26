import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';

import Layout from './components/layout/layout';
import { reducer } from './store/reducer';

const store = createStore(reducer);

ReactDOM.render(<Layout />, document.getElementById('root'));
registerServiceWorker();