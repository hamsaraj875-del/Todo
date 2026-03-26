const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const url = process.env.DB;

const store = new MongoDBStore({
  uri:url,
  collection:'session'
});

module.exports = store;