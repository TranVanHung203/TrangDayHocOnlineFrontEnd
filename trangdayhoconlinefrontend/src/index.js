import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Đường dẫn tới thành phần App chính

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // `root` là ID của phần tử DOM trong `public/index.html`
);
//a
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


