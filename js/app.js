import Product from './product.js';
import Detail from './detail.js';
import Login from './login.js';
import Join from './join.js';

const $main = document.getElementById('main-contents');

const routes = (url) => {
  let template = Product;
  switch(url) {
    case '/':
      template = Product;
      break;
    case '/login':
      template = Login;
      break;
    case '/join':
      template = Join;
      break;
    case '/detail':
      template = Detail;
      break;
    default:
      template = Product;
      break;
  }
  return template;
};

$main.appendChild(routes('/detail').template());