class Join {
  template() {
    return document.getElementById('template-join').content.cloneNode(true);
  }
}
export default new Join();