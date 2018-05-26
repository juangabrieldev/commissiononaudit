import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Layout from './components/layout/layout';
import { reducer } from './store/reducer';

const store = createStore(reducer);

ReactDOM.render(<Provider store={store}><Layout /></Provider>, document.getElementById('root'));
registerServiceWorker();