import {commonData} from "./common.js";
import {routes} from './app.js';

class Product {
  constructor(keyward = '') {
    this.keyward = keyward;
    this.$productList;
    this.$productItem;
    this.products;
  }

  template() {
    const docFrag = document.getElementById('template-product').content.cloneNode(true);
    this.$productList = docFrag.querySelector('.ul-product');
    this.getProducts();
    return docFrag;
  }

  addEvent() {
    this.$productList.addEventListener('click', function(e) {
      e.preventDefault();

      const $detail = e.target.closest('a');
      if($detail) {
        commonData.id = $detail.getAttribute('data-id');
        routes('/detail');
      }
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