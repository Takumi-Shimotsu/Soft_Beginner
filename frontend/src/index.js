// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css'; // 必要に応じてCSSファイルを作成
// import App from './App'; // 必要に応じてAppコンポーネントを作成

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // スタイルのインポート
// import Chatbot from './chatbot'; // Chatbotコンポーネントをインポート
import App from './App'; // Appコンポーネントをインポート

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // public/index.htmlの<div id="root"></div>にレンダリング
);