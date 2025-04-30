class Product {
  template() {
    return document.getElementById('template-product').content.cloneNode(true);
  }
}
export default new Product();