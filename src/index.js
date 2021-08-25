import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from './auth/initFirebase'
import {FirebaseAuthProvider} from '@react-firebase/auth'
import {config} from './auth/config'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAuthProvider {...config} firebase={firebase}>
      <App />
    </FirebaseAuthProvider>    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.register();