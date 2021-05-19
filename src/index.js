const express = require("express");
const path = require("path");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const SortMiddleware = require("./app/middlewares/SortMiddleware");
const app = express();
const port = 5008;
const route = require("./routes/index.route");
const db = require("./config/db");
const cors = require('cors')
app.use(express.static(path.join(__dirname, "public"))); //static file
const session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}))
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept, Access-Control-Allow-Origin');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
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
