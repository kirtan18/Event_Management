const { Pool } = require('pg');
const { dbConfig } = require('./index');

const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.name,
  password: dbConfig.password,
  port: dbConfig.port,
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
  // The maximum number of clients that the pool can contain.
  // If the requests for the client reach their max limit then new requests will receive an error.
  max: 30,
  // when a client is returned to the pool
  // the pool starts a timer for the idleTimeoutMillis duration. If the client remains idle for
  // that duration, the pool closes the client and removes it from the pool.
  idleTimeoutMillis: 30000,
  // pool return an error after specified milliseconds if new client can not be created
  connectionTimeoutMillis: 2000,
});

module.exports = {
  pool
};
