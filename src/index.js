import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Layout from './components/layout/layout';
import rootReducer from './store/reducers/rootReducer';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

ReactDOM.render(<Provider store={store}><Layout /></Provider>, document.getElementById('root'));
registerServiceWorker();