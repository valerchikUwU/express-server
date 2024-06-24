const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);


// Опции хранилища
const optionsStore = {
    host: process.env.host,
    port: process.env.port,
    user: process.env.db_user,
    password: process.env.password,
    database: process.env.db_name,
    // Whether or not to automatically check for and clear expired sessions:
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 360000000,
    // The maximum age of a valid session; milliseconds:
    expiration: 86400000,
    // Whether or not to create the sessions database table, if one does not already exist:
    createDatabaseTable: true,
    // Whether or not to end the database connection when the store is closed.
    // The default value of this option depends on whether or not a connection was passed to the constructor.
    // If a connection object is passed to the constructor, the default value for this option is false.
    endConnectionOnClose: true,
  };


  module.exports = { sessionStore: new MySQLStore(optionsStore) };