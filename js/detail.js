import {commonData} from "./common.js";

class Detail {
  constructor() {
    this.id;
    this.$shopName;
    this.$name;
    this.$price;
    this.$shipping;
    this.$img;
  }

  template() {
    const docFrag = document.getElementById('template-detail').content.cloneNode(true);
    this.id = commonData.id;
    this.$shopName = docFrag.querySelector('.shop-name');
    this.$name = docFrag.querySelector('.product-name');
    this.$price = docFrag.querySelector('.product-price');
    this.$shipping = docFrag.querySelector('.product-shipping');
    this.$img = docFrag.querySelector('.sec-product-detail img');
    this.getProductDetail();

    return docFrag;
  }

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

  setProductDetail(data) {
    console.log(data);
    this.$shopName.innerText = data.seller.store_name;
    this.$name.innerText = data.name;
    this.$price.innerHTML = data.price.toLocaleString('ko-KR') + '<span>원</span>';
    this.$shipping.innerText = `${data.shipping_method === 'PARCEL' ? '택배배송' : '배달'}${data.shipping_fee === 0 ? ' / 무료배송' : ` / 배송비: ${data.shipping_fee.toLocaleString('ko-KR')}`}`;
    this.$img.src = data.image;
  }
}
export default new Detail();