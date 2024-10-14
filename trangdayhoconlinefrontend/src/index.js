import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Đường dẫn tới thành phần App chính

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // `root` là ID của phần tử DOM trong `public/index.html`
);
