const methods = require("methods");
const Layer = require("./layer");
function Route() {
  this.stack = [];
}

methods.forEach(function (method) {
  Route.prototype[method] = function (handlers) {
    handlers.forEach((handler) => {
      let layer = new Layer("*", handler);
      layer.method = method;
      this.stack.push(layer);
    });
  };
});
Route.prototype.dispatch = function (req, res, out) {
  let index = 0;
  const next =  (err)=> {
      if(err) return out(err)
      if(index>=this.stack.length) return out(err)
      let layer = this.stack[index++]
      if(req.method.toLowerCase() === layer.method) {
        layer.handle_request(req, res, next)
      }else {
        next(err)
      }
  };
  next();
};
module.exports = Route;
