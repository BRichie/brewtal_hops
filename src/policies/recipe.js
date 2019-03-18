const ApplicationPolicy = require("./application");

module.exports = class RecipePolicy extends ApplicationPolicy {


  new() {
    return (this._isAdmin() || this._isMember());
  }

  create() {
    return this.new();
  }

 // #3
  edit() {
    return (this._isAdmin() || this._isOwner());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}