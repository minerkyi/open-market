class Login {
  template() {
    return document.getElementById('template-login').content.cloneNode(true);
  }
}
export default new Login();