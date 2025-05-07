import {commonData} from './common.js';
import {routes} from './app.js';

class Login {
  constructor() {
    this.$btnLogin;
    this.$btnJoin;
    this.$inputId;
    this.$inputPw;
    this.$textError;
    this.userId;
    this.userPw;
  }

  template() {
    return document.getElementById('template-login').content.cloneNode(true);
  }

  addEvent() {
    this.$btnLogin = document.getElementById('btn-login');
    this.$btnJoin = document.getElementById('btn-user-join');
    this.$inputId = document.getElementById('user-id');
    this.$inputPw = document.getElementById('user-pw');
    this.$textError = document.getElementsByClassName('text-error')[0];

    this.$btnLogin.addEventListener('click', (e) => {
      e.preventDefault();

      this.userId = this.$inputId.value.trim();
      this.userPw = this.$inputPw.value.trim();
      if(this.userId === '') {
        this.$textError.classList.remove('hidden');
        this.$inputId.focus();
      } else if(this.userPw === '') {
        this.$textError.classList.remove('hidden');
        this.$inputPw.focus();
      } else {
        this.callLogin();
      }
    });

    this.$btnJoin.addEventListener('click', (e) => {
      e.preventDefault();
      routes('/join');
    });
  }

  callLogin() {
    fetch(`${commonData.url}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': this.userId,
        'password': this.userPw
      })
    }).then((response) => {
      if(!response.ok) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
      return response.json();
    }).then((data) => {
      this.$textError.classList.add('hidden');
      document.cookie = `hodu-access=${encodeURIComponent(data.refresh)}`;
      routes('/product');
    }).catch((error) => {
      console.log(error);
      this.$textError.classList.remove('hidden');
      this.$inputPw.value = '';
      this.$inputPw.focus();
    });
  }
}
export default new Login();