class Detail {
  template() {
    return document.getElementById('template-detail').content.cloneNode(true);
  }
}
export default new Detail();