import {commonData} from "./common.js";
import { getCookie, routes } from "./app.js";

class Detail {
  constructor() {
    this.$shopName;
    this.$name;
    this.$price;
    this.$totalPrice;
    this.$totalQuantity;
    this.$shipping;
    this.$img;
    this.$btnPlus;
    this.$btnMinus;
    this.$inputQuantity;
    this.$btnBuy;
    this.$btnCart;
    this.$modalLogin;
    this.$modalClose;
    this.$modalYes;
    this.$modalNo;
    this.id;
    this.price = 0;
    this.stock = 0;
    this.quantity = 0;
  }

  template() {
    const docFrag = document.getElementById('template-detail').content.cloneNode(true);
    this.id = commonData.id;
    this.$shopName = docFrag.querySelector('.shop-name');
    this.$name = docFrag.querySelector('.product-name');
    this.$price = docFrag.querySelector('.product-price');
    this.$totalPrice = docFrag.querySelector('.text-total-price');
    this.$totalQuantity = docFrag.querySelector('.text-total-quantity');
    this.$shipping = docFrag.querySelector('.product-shipping');
    this.$img = docFrag.querySelector('.sec-product-detail img');
    this.getProductDetail();

    return docFrag;
  }

  addEvent() {
    this.$btnPlus = document.getElementById('btn-plus');
    this.$btnMinus = document.getElementById('btn-minus');
    this.$inputQuantity = document.getElementById('input-quantity');
    this.$btnBuy = document.querySelector('.product-order a:nth-of-type(1)');
    this.$btnCart = document.querySelector('.product-order a:nth-of-type(2)');
    this.$modalLogin = document.getElementById('modal-login');
    this.$modalClose = document.getElementById('btn-close');
    this.$modalYes = document.querySelectorAll('.btn-group button')[1];
    this.$modalNo = document.querySelectorAll('.btn-group button')[0];

    // 수량 더하기 이벤트 등록
    this.$btnPlus.addEventListener('click', () => {
      this.quantity = parseInt(this.$inputQuantity.value);
      if(this.quantity < this.stock ) {
        this.quantity++;
        this.$inputQuantity.value = this.quantity;
        this.calTotalPrice();
      }
    });

    // 수량 빼기 이벤트 등록
    this.$btnMinus.addEventListener('click', () => {
      this.quantity = parseInt(this.$inputQuantity.value);
      if(this.quantity > 1 ) {
        this.quantity--;
        this.$inputQuantity.value = this.quantity;
        this.calTotalPrice();
      }
    });

    // 바로 구매 이벤트 등록
    this.$btnBuy.addEventListener('click', (e) => {
      e.preventDefault();

      if(!getCookie('hodu-access')) {
        this.$modalLogin.showModal();
      }
    });

    // 장바구니 이벤트 등록
    this.$btnCart.addEventListener('click', (e) => {
      e.preventDefault();

      if(!getCookie('hodu-access')) {
        this.$modalLogin.showModal();
      }
    });

    // 모달창 닫기 이벤트 등록
    this.$modalClose.addEventListener('click', () => {
      this.$modalLogin.close();
    });

    // 모달창 아니오 이벤트 등록
    this.$modalNo.addEventListener('click', () => {
      this.$modalLogin.close();
    });

    // 모달찰 예 이벤트 등록
    this.$modalYes.addEventListener('click', () => {
      routes('/login');
    });
  }

  calTotalPrice() {
    this.$totalQuantity.innerText = this.quantity;
    console.log(this.$price.value, this.quantity);
    this.$totalPrice.innerHTML = `${(this.price * this.quantity).toLocaleString('ko-KR')}<span>원</span>`;
  }

  // 상품 상세 정보 가져오기
  getProductDetail() {
    fetch(`${commonData.url}/products/${this.id}`, {
      method: 'GET'
    }).then((response) => {
      if(!response.ok) {
        throw new Error('상품이 존재하지 않습니다.');
      }
      return response.json();
    }).then((data) => {
      this.setProductDetail(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  // 상품 상세 화면 데이터 바인딩
  setProductDetail(data) {
    console.log(data);
    const price = data.price.toLocaleString('ko-KR') + '<span>원</span>';
    this.$shopName.innerText = data.seller.store_name;
    this.$name.innerText = data.name;
    this.$price.innerHTML = price;
    this.$totalPrice.innerHTML = price;
    this.$shipping.innerText = `${data.shipping_method === 'PARCEL' ? '택배배송' : '배달'}${data.shipping_fee === 0 ? ' / 무료배송' : ` / 배송비: ${data.shipping_fee.toLocaleString('ko-KR')}`}`;
    this.$img.src = data.image;
    this.price = data.price;
    this.stock = data.stock;
  }
}
export default new Detail();