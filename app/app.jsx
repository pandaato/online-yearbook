const React = require('react');
const ReactDOM = require('react-dom');

/* Import Components */
const Splash = require('./Splash');
const Yearbook = require('./Yearbook');
const Information = require('./Information');
const View = require('./View');

if(window.location.href.indexOf("https://bee-ear-book.glitch.me/yearbook.html") > -1 ){
  console.log(window.location.href);
  ReactDOM.render(<Yearbook/>, document.getElementById('main'));
}else if(window.location.href=="https://bee-ear-book.glitch.me/user/creator.html"){
  console.log(window.location.href);
  ReactDOM.render(<Information/>, document.getElementById('main-user'));
}else if(window.location.href.indexOf("https://bee-ear-book.glitch.me/view") > -1){
  console.log(window.location.href);
  ReactDOM.render(<View/>, document.getElementById('main'));
}else{
  console.log(window.location.href);
  ReactDOM.render(<Splash/>, document.getElementById('main'));
}

