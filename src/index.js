const express = require("express");
const path = require("path");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const SortMiddleware = require("./app/middlewares/SortMiddleware");
const app = express();
const port = 5000;
const route = require("./routes/index.route");
const db = require("./config/db");

app.use(express.static(path.join(__dirname, "public"))); //static file

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(methodOverride("_method"));
//Connect to DB
db.connect();

//Custom middlewares
app.use(SortMiddleware);

//HTTP logger
// app.use(morgan('combined'))

//Template engine
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    helpers: require('./helper/handlebars'),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

//Routes init
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
