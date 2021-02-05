const express = require("./express");
console.log(express);
const app = express();
app.use( (req, res, next) => {
  req.a =1 
  next()
});
app.get(
  "/",
  (req, res, next) => {
    console.log(1);
    next();
    console.log(4);
  },
  (req, res, next) => {
    console.log(2);
    next({a:1});
    console.log(5);
  },
  (req, res, next) => {
    console.log(3);
    next();
    console.log(req.a);
  }
);

app.get("/", (req, res, next) => {
    res.end("hell world")
});

app.use( (err,req, res, next) => {
 res.end("error")
});
app.listen("3000", () => {
  console.log("server at port 3000");
});
