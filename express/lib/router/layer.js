function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
}
Layer.prototype.match = function (pathname) {
  return pathname === this.path;
};
Layer.prototype.handle_request = function (req, res, out) {
  this.handler(req, res, out);
};
module.exports = Layer;
