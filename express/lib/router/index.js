const methods = require("methods");
const url = require("url");
const Route = require("./route");
const Layer = require("./layer");

function Router() {
  this.stack = [];
}
Router.prototype.route = function (path) {
  let route = new Route();
  let layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
};
methods.forEach(function (method) {
  Router.prototype[method] = function (path, handlers) {
    let route = this.route(path);
    route[method](handlers);
  };
});
Router.prototype.use = function (path, ...handlers) {
  console.log(path,handlers)
  if (!handlers[0]) {
    handlers.push(path);
    path = "/";
  }
  handlers.forEach((handler) => {
    let layer = new Layer(path, handler);
    this.stack.push(layer);
  });
};
Router.prototype.handler = function (req, res, out) {
  let index = 0;
  let { pathname } = url.parse(req.url);
  const next = (err) => {
    if (index >= this.stack.length) return out();
    let layer = this.stack[index++];
    if (err) {
      if (!layer.route) {
        if (layer.handler.length !== 4) {
          next(err);
        } else {
          layer.handler(err, req, res, next);
        }
      } else {
        next(err);
      }
    } else {
      if (layer.match(pathname)) {
        if (!layer.route) {
          if (layer.handler.length !== 4) {
            layer.handle_request(req, res, next);
          } else {
            next();
          }
        } else {
          layer.handle_request(req, res, next);
        }
      } else {
        next();
      }
    }
  };
  next();
};
module.exports = Router;
