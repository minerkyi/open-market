import {commonData} from "./common.js";
import {routes} from './app.js';

class Product {
  constructor(keyward = '') {
    this.keyward = keyward;
    this.$productList;
    this.$btnBannerPrev;
    this.$btnBannerNext;
    this.$bannerItems;
    this.$bannerDots;
    this.products;
    this.bannerIdx = 0;
  }

  template() {
    const docFrag = document.getElementById('template-product').content.cloneNode(true);
    this.$productList = docFrag.querySelector('.ul-product');
    this.getProducts();
    return docFrag;
  }

  addEvent() {
    this.$btnBannerPrev = document.getElementsByClassName('slider-prev')[0];
    this.$btnBannerNext = document.getElementsByClassName('slider-next')[0];
    this.$bannerItems = document.querySelectorAll('.slider-item');
    this.$bannerDots = document.querySelectorAll('.slider-dot');

    // 상품 목록 클릭 이벤트 등록 -> 상품 상세 페이지 이동
    this.$productList.addEventListener('click', function(e) {
      e.preventDefault();

      const $detail = e.target.closest('a');
      if($detail) {
        commonData.id = $detail.getAttribute('data-id');
        routes('/detail');
      }
    });

    // 배너 보기 이전 이벤트 등록
    this.$btnBannerPrev.addEventListener('click', () => {
      this.bannerIdx--;

      if(this.bannerIdx < 0) {
        this.bannerIdx = this.$bannerItems.length - 1;
      }

      this.$bannerItems.forEach((el) => {
        el.classList.remove('active');
      });
      this.$bannerItems[this.bannerIdx].classList.add('active');

      this.$bannerDots.forEach((el) => {
        el.classList.remove('active');
      });
      this.$bannerDots[this.bannerIdx].classList.add('active');
    });

    // 배너 보기 다음 이벤트 등록
    this.$btnBannerNext.addEventListener('click', () => {
      this.bannerIdx++;

      if(this.bannerIdx >= this.$bannerItems.length) {
        this.bannerIdx = 0;
      }

      this.$bannerItems.forEach((el) => {
        el.classList.remove('active');
      });
      this.$bannerItems[this.bannerIdx].classList.add('active');

      this.$bannerDots.forEach((el) => {
        el.classList.remove('active');
      });
      this.$bannerDots[this.bannerIdx].classList.add('active');
    });

    // 배너 보기 하단 이동 이벤트 등록
    this.$bannerDots.forEach((el) => {
      el.addEventListener('click', () => {
        this.bannerIdx = el.getAttribute('data-index');
        this.$bannerItems.forEach((el) => {
          el.classList.remove('active');
        });
        this.$bannerItems[this.bannerIdx].classList.add('active');
  
        this.$bannerDots.forEach((el) => {
          el.classList.remove('active');
        });
        this.$bannerDots[this.bannerIdx].classList.add('active');
      });
    });
  }

  getProducts() {
    let path = '/products/';
    if(this.keyward !== '') {
      path += `?search=${decodeURIComponent(this.keyward)}`;
    }
    fetch(`${commonData.url}${path}`, {
      method: 'GET'
    }).then((response) => {
      if(!response.ok) {
        throw new Error('상품 조회에 실패하였습니다.');
      }
      return response.json();
    }).then((data) => {
      this.products = data.results;
      this.createProductList();
    }).catch((error) => {
      console.log(error);
    });
  }

  createProductList() {
    let $li;
    this.products.forEach((data) => {
      $li = document.createElement('li');
      $li.classList.add('li-product-item');
      $li.innerHTML = `
        <a href="#" data-id=${data.id}>
          <img src="${data.image}" alt="${data.info}">
          <div class="product-description">
            <p>${data.seller.store_name}</p>
            <p>${data.name}</p>
            <p>${data.price.toLocaleString('ko-KR')} 원</p>
          </div>
        </a>
      `;
      this.$productList.append($li);
    });
  }
}
export default new Product();