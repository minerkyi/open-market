import { routes } from "./app.js";
import { commonData } from "./common.js";

class Join {
  constructor() {
    this.$btnJoin;
    this.$btnCheck;
    this.$inputId;
    this.$inputPw;
    this.$inputRepw;
    this.$inputName;
    this.$inputPhone1;
    this.$inputPhone2;
    this.$inputPhone3;
    this.$textIdError;
    this.$textRepwError;
    this.userId;
    this.userPw;
    this.userRepw;
    this.userName;
    this.phoneNum1;
    this.phoneNum2;
    this.phoneNum3;
  }

  template() {
    return document.getElementById('template-join').content.cloneNode(true);
  }

  addEvent() {
    this.$btnJoin = document.getElementById('btn-join');
    this.$btnCheck = document.getElementById('btn-check');
    this.$inputId = document.getElementById('user-id');
    this.$inputIsDupl = document.getElementById('user-is-dupl');
    this.$inputPw = document.getElementById('user-pw');
    this.$inputRepw = document.getElementById('recheck-pw');
    this.$inputName = document.getElementById('user-name');
    this.$selectNum = document.getElementById('select-number');
    this.$inputPhone1 = document.getElementById('user-phone1');
    this.$inputPhone2 = document.getElementById('user-phone2');
    this.$inputPhone3 = document.getElementById('user-phone3');
    this.$checkbox = document.getElementById('check-agree');
    this.$textIdError = document.getElementsByClassName('text-id-error')[0];
    this.$textPwError = document.getElementsByClassName('text-pw-error')[0];
    this.$textRepwError = document.getElementsByClassName('text-repw-error')[0];
    this.$textNameError = document.getElementsByClassName('text-name-error')[0];
    this.$textPhoneError = document.getElementsByClassName('text-phone-error')[0];
    this.userId;
    this.userPw;
    this.userName;
    this.phoneNum1;
    this.phoneNum2;
    this.phoneNum3;

    this.regBlurEvent(this.$inputId, this.$textIdError);
    this.regBlurEvent(this.$inputPw, this.$textPwError);
    this.regBlurEvent(this.$inputRepw, this.$textRepwError);
    this.regBlurEvent(this.$inputName, this.$textNameError);
    this.regBlurEvent(this.$inputPhone2, this.$textPhoneError);
    this.regBlurEvent(this.$inputPhone3, this.$textPhoneError);

    // 아이디 중복확인 이벤트 등록
    this.$btnCheck.addEventListener('click', (e) => {
      e.preventDefault();

      this.userId = this.$inputId.value;
      if(this.userId.trim() === '') {
        this.inputError(this.$inputId, this.$textIdError, true);
        this.$textIdError.innerText = '필수 정보입니다.';
      } else {
        if(this.validationInput(this.$inputId, this.$textIdError)) {
          this.checkDuplId();
        }
      }
    });

    // 휴대폰 앞번호 클릭 이벤트 등록
    this.$inputPhone1.addEventListener('click', () => {
      this.$selectNum.classList.toggle('hidden');
    });
    // 휴대폰 앞번호 선택 이벤트 등록
    this.$selectNum.addEventListener('click', (e) => {
      if(e.target.tagName === 'LI') {
        this.$inputPhone1.value = e.target.innerText;
      }
    });

    // 회원가입 동의 이벤트 등록
    this.$checkbox.addEventListener('change', () => {
      this.activeBtnJoin();
    });

    // 가입하기 이벤트 등록
    this.$btnJoin.addEventListener('click', (e) => {
      e.preventDefault();
      
      if(this.validationAll()) {
          this.callSignup();
      } else {
        this.activeBtnJoin();
      }
    });

    // 아이디 키-인 이벤트 등록
    this.$inputId.addEventListener('input', () => {
      this.$inputIsDupl.value = 'Y';
    });
  }

  // 구매자 회원가입
  callSignup() {
    this.userId = this.$inputId.value;
    this.userPw = this.$inputPw.value;
    this.userName = this.$inputName.value;
    this.phoneNum1 = this.$inputPhone1.value;
    this.phoneNum2 = this.$inputPhone2.value;
    this.phoneNum3 = this.$inputPhone3.value;

    fetch(`${commonData.url}/accounts/buyer/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': this.userId,
        'password': this.userPw,
        'name': this.userName,
        'phone_number': this.phoneNum1 + this.phoneNum2 + this.phoneNum3
      })
    }).then((response) => {
      if(!response.ok) {
        throw new Error('회원가입에 실패하였습니다.');
      }
      return response.json();
    }).then((data) => {
      routes('/login');
    }).catch((error) => {
      console.log(error);
    });
  }

  // 아이디 중복 체크
  checkDuplId() {
    fetch(`${commonData.url}/accounts/validate-username/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': this.userId
      })
    }).then((response) => {
      if(!response.ok) {
        throw new Error('이미 사용 중인 아이디입니다.');
      }
      return response.json();
    }).then((data) => {
      this.inputError(this.$inputId, this.$textIdError, false);
      this.$textIdError.classList.remove('hidden');
      this.$textIdError.classList.add('success');
      this.$textIdError.innerText = '멋진 아이디네요 :)';
      this.$inputIsDupl.value = 'N';
      this.activeBtnJoin();
    }).catch((error) => {
      console.log(error);
      this.inputError(this.$inputId, this.$textIdError, true);
      this.$textIdError.classList.remove('success');
      this.$textIdError.innerText = '이미 사용 중인 아이디입니다.';
      this.$inputIsDupl.value = 'Y';
    });
  }

  regBlurEvent(el, elText) {
    el.addEventListener('blur', () => {
      if(el.value.trim() === '') {
        this.inputError(el, elText, true);
        elText.innerText = '필수 정보입니다.';
        this.$btnJoin.classList.remove('active');
      } else {
        if(this.validationInput(el, elText)) {
          this.inputError(el, elText, false);
        }
        this.activeBtnJoin();
      }
    });
  }

  activeBtnJoin() {
    if(this.validationAll()) {
      this.$btnJoin.classList.add('active');
    } else {
      this.$btnJoin.classList.remove('active');
    }
  }

  inputError(el, elText, isError) {
    if(isError) {
      el.classList.add('error');
      elText.classList.remove('hidden');
    } else {
      el.classList.remove('error');
      elText.classList.add('hidden');
    }
  }

  validationId(el = this.$inputId) {
    const regex = /^[A-Za-z0-9]{4,20}$/;
    if(!regex.test(el.value)) {
      return false;
    }

    return true;
  }
  viewErrorId(el, elText) {
    this.inputError(el, elText, true);
    elText.classList.remove('success');
    elText.innerText = '20자 이내의 영문 소문자,대문자,숫자만 사용 가능합니다.';
  }

  validationPw(el = this.$inputPw) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    if(!regex.test(el.value)) {
      return false;
    }

    return true;
  }
  viewErrorPw(el, elText) {
    this.inputError(el, elText, true);
    el.classList.remove('active');
    elText.innerText = '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.';
  }

  validationRepw(el = this.$inputRepw) {
    if(el.value !== this.$inputPw.value) {
      return false;
    }

    return true;
  }
  viewErrorRepw(el, elText) {
    this.inputError(el, elText, true);
    el.classList.remove('active');
    elText.innerText = '비밀번호가 일치하지 않습니다.';

    if(this.$inputPw.value.trim() === '') {
      this.inputError(this.$inputPw, this.$textPwError, true);
      this.$textPwError.innerText = '필수 정보입니다.'
    }
  }

  validationName(el = this.$inputName) {
    if(el.value.trim() === '') {
      return false;
    }

    return true;
  }

  validationPhone(el = this.$inputPhone2) {
    const regex = /^[0-9]{3,4}$/;
    if(!regex.test(el.value)) {
      return false;
    }

    return true;
  }
  viewErrorEtc(el, elText) {
    this.inputError(el, elText, true);
  }

  validationInput(el, elText) {
    if(el.id === 'user-id') {
      if(!this.validationId(el)) {
        this.viewErrorId(el, elText);
        return false;
      }
    } else if(el.id === 'user-pw') {
      if(!this.validationPw(el)) {
        this.viewErrorPw(el, elText);
        return false;
      }
      el.classList.add('active');
    } else if(el.id === 'recheck-pw') {
      if(!this.validationRepw(el)) {
        this.viewErrorRepw(el, elText);
        return false;
      }
      el.classList.add('active');
    } else if(el.id === 'user-phone2') {
      if(!this.validationPhone(el)) {
        this.viewErrorEtc(el, elText);
        return false;
      }
    } else if(el.id === 'user-phone3') {
      if(!this.validationPhone(el)) {
        this.viewErrorEtc(el, elText);
        return false;
      }
    } else if(el.id === 'user-name') {
      if(el.value.trim() === '') {
        this.viewErrorEtc(el, elText);
        return false;
      }
    }

    return true;
  }

  validationAll() {
    if(!this.validationId()) {
      return false;
    }
    if(this.$inputIsDupl.value === 'Y') {
      return false;
    }
    if(!this.validationPw()) {
      return false;
    }
    if(!this.validationRepw()) {
      return false;
    }
    if(!this.validationName()) {
      return false;
    }
    if(!this.validationPhone()) {
      return false;
    }
    if(!this.validationPhone(this.$inputPhone3)) {
      return false;
    }
    if(!this.$checkbox.checked) {
      return false;
    }
    return true;
  }
}
export default new Join();