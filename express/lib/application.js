const http = require("http");
const methods = require("methods");
const Router = require("./router");
function Application() {}
Application.prototype.lazy_route = function () {
  if (this._router) return;
  this._router = new Router();
};
methods.forEach(function (method) {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazy_route();
    this._router[method](path, handlers);
  };
});

Application.prototype.use = function () {
     this.lazy_route()
     this._router.use(...arguments);
}
Application.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    this.lazy_route();
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`); //如果路由系统处理不了   就交给应用来处理
    }
    this._router.handler(req, res, done);
  });
  server.listen(...args);
};
module.exports = Application;
