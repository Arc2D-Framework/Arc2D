window.Key = {
  _pressed: {},
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  A: "KeyA",
  D: "KeyD",

  isDown: function(code) {
    return this._pressed[code];
  },
  
  onKeydown: function(e) {
    this._pressed[e.code] = true;
  },
  
  onKeyup: function(e) {
    delete this._pressed[e.code];
  }
};
window.addEventListener('keyup', function(e) { Key.onKeyup(e); }, false);
window.addEventListener('keydown', function(e) { Key.onKeydown(e); }, false);
