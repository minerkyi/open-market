import Product from './product.js';
import Detail from './detail.js';
import Login from './login.js';
import Join from './join.js';
import { commonData } from './common.js';

const $main = document.getElementById('main-contents');
const $header = document.getElementById('header');
const $footer = document.getElementById('footer');
const $btnMypage = document.getElementById('btn-mypage');
const $btnLogout = document.getElementById('btn-logout');
const $mypageBox = document.getElementsByClassName('sec-mypage-box')[0];
let template = Product;

const routes = (url, isHis = true) => {
  switch(url) {
    case '/':
      showHeader();
      template = Product;
      break;
    case '/login':
      hideHeader();
      template = Login;
      break;
    case '/join':
      hideHeader();
      template = Join;
      break;
    case '/detail':
      showHeader();
      template = Detail;
      break;
    default:
      showHeader();
      template = Product;
      break;
  }
  viewContents(template);
  if(isHis) {
    window.history.pushState({path:url, id:commonData.id}, null, `?#${url}`);
  } else {
    window.history.replaceState({path:url, id:commonData.id}, null, `?#${url}`);
  }
  commonData.path = url;
};

const viewContents = (template) => {
  $main.innerHTML = '';
  $main.appendChild(template.template());
  if(template.addEvent) {
    template.addEvent();
  }
};

const showHeader = () => {
  const $textMypage = document.getElementById('text-mypage');
  if(getCookie('hodu-access')) {
    $textMypage.innerText = '마이페이지';
  } else {
    $textMypage.innerText = '로그인';
  }
  $header.classList.remove('hidden');
  $footer.classList.remove('hidden');
};

const hideHeader = () => {
  $header.classList.add('hidden');
  $footer.classList.add('hidden');
};

const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));

  return matches ? decodeURIComponent(matches[1]) : undefined;
};

$btnMypage.addEventListener('click', (e) => {
  e.preventDefault();

  if(getCookie('hodu-access')) {
    $mypageBox.classList.remove('hidden');
  } else {
    routes('/login');
  }
});

$btnLogout.addEventListener('click', () => {
  document.cookie = 'hodu-access=';
  routes('/login');
});

document.addEventListener('click', (e) => {
  if(e.target.id !== 'btn-mypage') {
    $mypageBox.classList.add('hidden');
  }
});

window.addEventListener('popstate', (e) => {
  console.log(e.state);
  if(e.state && e.state.path) {
    commonData.id = e.state.id;
    routes(e.state.path, false);
  }
});
export {routes, getCookie};

routes('/product', false);